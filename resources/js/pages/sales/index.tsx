import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Head, Link, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Transaksi', href: '/sales' },
];

interface Sale {
    id: number;
    invoice_number: string;
    total_amount: number;
    payment_method: string;
    status: string;
    created_at: string;
    user: {
        name: string;
    };
    sale_items: Array<{
        quantity: number;
    }>;
}

interface SalesIndexProps {
    sales: {
        data: Sale[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        meta: { from: number; to: number; total: number };
    };
    filters: {
        date_from?: string;
        date_to?: string;
        payment_method?: string;
        status?: string;
    };
    [key: string]: unknown;
}

export default function SalesIndex({ sales, filters }: SalesIndexProps) {
    const [searchFilters, setSearchFilters] = useState(filters);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleFilter = () => {
        router.get('/sales', searchFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilters = () => {
        setSearchFilters({});
        router.get('/sales');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentMethodIcon = (method: string) => {
        return method === 'cash' ? '💵' : '🏦';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Transaksi" />
            
            <div className="space-y-6 p-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Daftar Transaksi</h1>
                    <Link href="/sales/create">
                        <Button className="bg-green-600 hover:bg-green-700">
                            🛒 Transaksi Baru
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tanggal Dari
                            </label>
                            <input
                                type="date"
                                value={searchFilters.date_from || ''}
                                onChange={(e) => setSearchFilters({ ...searchFilters, date_from: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tanggal Sampai
                            </label>
                            <input
                                type="date"
                                value={searchFilters.date_to || ''}
                                onChange={(e) => setSearchFilters({ ...searchFilters, date_to: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Metode Pembayaran
                            </label>
                            <select
                                value={searchFilters.payment_method || ''}
                                onChange={(e) => setSearchFilters({ ...searchFilters, payment_method: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Semua</option>
                                <option value="cash">Tunai</option>
                                <option value="transfer">Transfer</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                value={searchFilters.status || ''}
                                onChange={(e) => setSearchFilters({ ...searchFilters, status: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Semua</option>
                                <option value="completed">Selesai</option>
                                <option value="pending">Pending</option>
                                <option value="cancelled">Batal</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex space-x-3 mt-4">
                        <Button onClick={handleFilter} variant="outline">
                            🔍 Filter
                        </Button>
                        <Button onClick={resetFilters} variant="outline">
                            🔄 Reset
                        </Button>
                    </div>
                </div>

                {/* Sales Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        No. Invoice
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kasir
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Pembayaran
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tanggal
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sales.data.map((sale) => (
                                    <tr key={sale.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">
                                                {sale.invoice_number}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {sale.sale_items.reduce((sum, item) => sum + item.quantity, 0)} items
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-gray-900">{sale.user.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-bold text-green-600">
                                                {formatCurrency(sale.total_amount)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <span className="mr-2">
                                                    {getPaymentMethodIcon(sale.payment_method)}
                                                </span>
                                                {sale.payment_method === 'cash' ? 'Tunai' : 'Transfer'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(sale.status)}`}>
                                                {sale.status === 'completed' ? 'Selesai' : 
                                                 sale.status === 'pending' ? 'Pending' : 'Batal'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(sale.created_at).toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Link
                                                href={`/sales/${sale.id}`}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Detail
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {sales.links && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                            <div className="flex-1 flex justify-between sm:hidden">
                                {sales.links.map((link, index) => {
                                    if (link.label === '&laquo; Previous' || link.label === 'Next &raquo;') {
                                        return (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                                                    link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{sales.meta.from || 0}</span> to{' '}
                                        <span className="font-medium">{sales.meta.to || 0}</span> of{' '}
                                        <span className="font-medium">{sales.meta.total}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        {sales.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`relative inline-flex items-center px-2 py-2 border text-sm font-medium ${
                                                    link.active
                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                } ${index === 0 ? 'rounded-l-md' : ''} ${
                                                    index === sales.links.length - 1 ? 'rounded-r-md' : ''
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Empty State */}
                {sales.data.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <div className="text-6xl mb-4">🛒</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Transaksi</h3>
                        <p className="text-gray-600 mb-6">Mulai membuat transaksi pertama Anda</p>
                        <Link href="/sales/create">
                            <Button className="bg-green-600 hover:bg-green-700">
                                Buat Transaksi Baru
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}