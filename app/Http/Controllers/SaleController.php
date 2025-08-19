<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSaleRequest;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SaleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Sale::with(['user', 'saleItems.product']);

        if ($request->has('date_from') && $request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to') && $request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        if ($request->has('payment_method') && $request->payment_method) {
            $query->where('payment_method', $request->payment_method);
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $sales = $query->latest()->paginate(15);

        return Inertia::render('sales/index', [
            'sales' => $sales,
            'filters' => $request->only(['date_from', 'date_to', 'payment_method', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $products = Product::active()->get();
        
        return Inertia::render('sales/create', [
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSaleRequest $request)
    {
        try {
            DB::beginTransaction();

            // Calculate totals
            $subtotal = 0;
            $items = $request->input('items');
            
            foreach ($items as $item) {
                $product = Product::find($item['product_id']);
                if (!$product || $product->stock_quantity < $item['quantity']) {
                    throw new \Exception('Stok tidak mencukupi untuk produk: ' . ($product->name ?? 'Unknown'));
                }
                
                $itemTotal = ($item['unit_price'] - ($item['discount_per_item'] ?? 0)) * $item['quantity'];
                $subtotal += $itemTotal;
            }

            $discountAmount = $request->input('discount_amount', 0);
            $totalAmount = $subtotal - $discountAmount;

            // Create sale
            $sale = Sale::create([
                'invoice_number' => Sale::generateInvoiceNumber(),
                'user_id' => auth()->id(),
                'subtotal' => $subtotal,
                'discount_amount' => $discountAmount,
                'total_amount' => $totalAmount,
                'payment_method' => $request->input('payment_method'),
                'transfer_reference' => $request->input('transfer_reference'),
                'notes' => $request->input('notes'),
                'status' => 'completed',
            ]);

            // Create sale items and update stock
            foreach ($items as $item) {
                $product = Product::find($item['product_id']);
                
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'discount_per_item' => $item['discount_per_item'] ?? 0,
                    'total_price' => ($item['unit_price'] - ($item['discount_per_item'] ?? 0)) * $item['quantity'],
                ]);

                // Update product stock
                $product->decrement('stock_quantity', $item['quantity']);
            }

            DB::commit();

            return redirect()->route('sales.show', $sale)
                ->with('success', 'Transaksi berhasil disimpan.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Sale $sale)
    {
        $sale->load(['user', 'saleItems.product']);
        
        return Inertia::render('sales/show', [
            'sale' => array_merge($sale->toArray(), [
                'total_profit' => $sale->calculateTotalProfit(),
            ]),
        ]);
    }
}