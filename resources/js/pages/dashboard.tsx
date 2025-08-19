import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardProps {
    stats: {
        today_sales: number;
        today_transactions: number;
        total_products: number;
        low_stock_products: number;
        total_users?: number;
        monthly_sales?: number;
    };
    recent_sales: Array<{
        id: number;
        invoice_number: string;
        total_amount: number;
        payment_method: string;
        created_at: string;
        user: {
            name: string;
        };
        sale_items: Array<{
            quantity: number;
        }>;
    }>;
    low_stock_products: Array<{
        id: number;
        name: string;
        stock_quantity: number;
        min_stock: number;
    }>;
    sales_chart: Array<{
        date: string;
        amount: number;
    }>;
    [key: string]: unknown;
}

export default function Dashboard({ stats, recent_sales, low_stock_products, sales_chart }: DashboardProps) {
    const user = (window as unknown as { auth?: { user?: { role: string } } }).auth?.user;
    const isAdmin = user?.role === 'admin';

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="space-y-6 p-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Kasir</h1>
                    <div className="flex space-x-3">
                        <Link href="/sales/create">
                            <Button className="bg-green-600 hover:bg-green-700">
                                🛒 Transaksi Baru
                            </Button>
                        </Link>
                        {isAdmin && (
                            <Link href="/products/create">
                                <Button variant="outline">
                                    📦 Tambah Produk
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Penjualan Hari Ini</h3>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.today_sales)}</p>
                            </div>
                            <div className="text-3xl">💰</div>
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Transaksi Hari Ini</h3>
                                <p className="text-2xl font-bold text-gray-900">{stats.today_transactions}</p>
                            </div>
                            <div className="text-3xl">🛍️</div>
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Produk</h3>
                                <p className="text-2xl font-bold text-gray-900">{stats.total_products}</p>
                            </div>
                            <div className="text-3xl">📦</div>
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Stok Menipis</h3>
                                <p className="text-2xl font-bold text-gray-900">{stats.low_stock_products}</p>
                            </div>
                            <div className="text-3xl">⚠️</div>
                        </div>
                    </div>
                </div>

                {/* Admin Only Stats */}
                {isAdmin && stats.total_users && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-indigo-500">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Pengguna</h3>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total_users}</p>
                                </div>
                                <div className="text-3xl">👥</div>
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-yellow-500">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Penjualan Bulanan</h3>
                                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.monthly_sales || 0)}</p>
                                </div>
                                <div className="text-3xl">📊</div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Sales */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                            📋 Transaksi Terbaru
                        </h3>
                        {recent_sales && recent_sales.length > 0 ? (
                            <div className="space-y-3">
                                {recent_sales.map((sale) => (
                                    <div key={sale.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                        <div>
                                            <p className="font-medium">{sale.invoice_number}</p>
                                            <p className="text-sm text-gray-600">
                                                {sale.user.name} • {new Date(sale.created_at).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-green-600">{formatCurrency(sale.total_amount)}</p>
                                            <p className="text-xs text-gray-500">
                                                {sale.sale_items ? sale.sale_items.reduce((sum, item) => sum + item.quantity, 0) : 0} items
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div className="text-center mt-4">
                                    <Link href="/sales" className="text-blue-600 hover:text-blue-800">
                                        Lihat Semua Transaksi →
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">Belum ada transaksi hari ini</p>
                        )}
                    </div>
                    
                    {/* Low Stock Products */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                            ⚠️ Produk Stok Menipis
                        </h3>
                        {low_stock_products && low_stock_products.length > 0 ? (
                            <div className="space-y-3">
                                {low_stock_products.map((product) => (
                                    <div key={product.id} className="flex justify-between items-center p-3 bg-red-50 rounded border-l-4 border-red-400">
                                        <div>
                                            <p className="font-medium">{product.name}</p>
                                            <p className="text-sm text-gray-600">
                                                Min: {product.min_stock} pcs
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-red-600">{product.stock_quantity} pcs</p>
                                            <p className="text-xs text-red-500">Perlu restock</p>
                                        </div>
                                    </div>
                                ))}
                                {isAdmin && (
                                    <div className="text-center mt-4">
                                        <Link href="/products?low_stock=1" className="text-blue-600 hover:text-blue-800">
                                            Kelola Stok Produk →
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">Semua produk stok aman</p>
                        )}
                    </div>
                </div>

                {/* Sales Chart */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold mb-4">📈 Grafik Penjualan 7 Hari Terakhir</h3>
                    <div className="flex items-end space-x-2 h-32">
                        {sales_chart && sales_chart.map((day, index) => {
                            const maxAmount = Math.max(...sales_chart.map(d => d.amount));
                            const height = maxAmount > 0 ? (day.amount / maxAmount) * 100 : 0;
                            
                            return (
                                <div key={index} className="flex-1 flex flex-col items-center">
                                    <div 
                                        className="bg-blue-500 w-full rounded-t transition-all duration-300 hover:bg-blue-600"
                                        style={{ height: `${height}%`, minHeight: '4px' }}
                                        title={formatCurrency(day.amount)}
                                    ></div>
                                    <p className="text-xs text-gray-600 mt-2 transform rotate-45 origin-left">
                                        {new Date(day.date).toLocaleDateString('id-ID', { 
                                            month: 'short', 
                                            day: 'numeric' 
                                        })}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}