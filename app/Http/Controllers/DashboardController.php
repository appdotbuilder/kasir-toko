<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Sale;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        
        // Basic stats
        $stats = [
            'today_sales' => Sale::today()->completed()->sum('total_amount'),
            'today_transactions' => Sale::today()->completed()->count(),
            'total_products' => Product::active()->count(),
            'low_stock_products' => Product::active()->lowStock()->count(),
        ];

        // Admin-only stats
        if ($user->isAdmin()) {
            $stats['total_users'] = User::active()->count();
            $stats['monthly_sales'] = Sale::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->completed()
                ->sum('total_amount');
        }

        // Recent sales
        $recentSales = Sale::with(['user', 'saleItems'])
            ->when($user->isCashier(), function ($query) use ($user) {
                return $query->where('user_id', $user->id);
            })
            ->completed()
            ->latest()
            ->limit(5)
            ->get();

        // Low stock products
        $lowStockProducts = Product::active()->lowStock()->limit(5)->get();

        // Sales chart data for the last 7 days
        $salesChart = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $sales = Sale::whereDate('created_at', $date)
                ->when($user->isCashier(), function ($query) use ($user) {
                    return $query->where('user_id', $user->id);
                })
                ->completed()
                ->sum('total_amount');
            
            $salesChart[] = [
                'date' => $date->format('Y-m-d'),
                'amount' => $sales,
            ];
        }

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recent_sales' => $recentSales,
            'low_stock_products' => $lowStockProducts,
            'sales_chart' => $salesChart,
        ]);
    }
}