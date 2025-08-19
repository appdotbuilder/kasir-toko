<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SaleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Home page - POS welcome page
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Sales routes (accessible by both admin and cashier)
    Route::resource('sales', SaleController::class)->only(['index', 'create', 'store', 'show']);
    
    // Product routes (admin only for CUD, read for cashiers)
    Route::resource('products', ProductController::class);
    
    // Reports (admin only)
    Route::middleware([App\Http\Middleware\AdminMiddleware::class])->group(function () {
        Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
