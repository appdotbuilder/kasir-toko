<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Display sales reports.
     */
    public function index(Request $request)
    {
        // Only admins can access reports
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Unauthorized');
        }

        $dateFrom = $request->input('date_from', now()->startOfMonth()->format('Y-m-d'));
        $dateTo = $request->input('date_to', now()->format('Y-m-d'));

        // Sales summary
        $salesSummary = Sale::whereBetween('created_at', [$dateFrom . ' 00:00:00', $dateTo . ' 23:59:59'])
            ->completed()
            ->selectRaw('
                COUNT(*) as total_transactions,
                SUM(total_amount) as total_sales,
                SUM(discount_amount) as total_discounts,
                AVG(total_amount) as average_sale,
                SUM(CASE WHEN payment_method = "cash" THEN total_amount ELSE 0 END) as cash_sales,
                SUM(CASE WHEN payment_method = "transfer" THEN total_amount ELSE 0 END) as transfer_sales
            ')
            ->first();

        // Top selling products
        $topProducts = SaleItem::whereHas('sale', function ($query) use ($dateFrom, $dateTo) {
                $query->whereBetween('created_at', [$dateFrom . ' 00:00:00', $dateTo . ' 23:59:59'])
                      ->where('status', 'completed');
            })
            ->with('product')
            ->select('product_id')
            ->selectRaw('SUM(quantity) as total_quantity')
            ->selectRaw('SUM(total_price) as total_revenue')
            ->groupBy('product_id')
            ->orderByDesc('total_quantity')
            ->limit(10)
            ->get();

        // Sales by cashier
        $salesByCashier = Sale::with('user')
            ->whereBetween('created_at', [$dateFrom . ' 00:00:00', $dateTo . ' 23:59:59'])
            ->completed()
            ->select('user_id')
            ->selectRaw('COUNT(*) as total_transactions')
            ->selectRaw('SUM(total_amount) as total_sales')
            ->groupBy('user_id')
            ->orderByDesc('total_sales')
            ->get();

        // Daily sales chart
        $dailySales = Sale::whereBetween('created_at', [$dateFrom . ' 00:00:00', $dateTo . ' 23:59:59'])
            ->completed()
            ->selectRaw('DATE(created_at) as sale_date')
            ->selectRaw('SUM(total_amount) as daily_total')
            ->selectRaw('COUNT(*) as daily_transactions')
            ->groupBy('sale_date')
            ->orderBy('sale_date')
            ->get();

        return Inertia::render('reports/index', [
            'sales_summary' => $salesSummary,
            'top_products' => $topProducts,
            'sales_by_cashier' => $salesByCashier,
            'daily_sales' => $dailySales,
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
        ]);
    }
}