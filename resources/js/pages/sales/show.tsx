import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Transaksi', href: '/sales' },
    { title: 'Detail Transaksi', href: '#' },
];

interface SaleItem {
    id: number;
    quantity: number;
    unit_price: number;
    discount_per_item: number;
    total_price: number;
    product: {
        id: number;
        name: string;
        sku: string;
    };
}

interface Sale {
    id: number;
    invoice_number: string;
    subtotal: number;
    discount_amount: number;
    total_amount: number;
    payment_method: string;
    transfer_reference: string | null;
    notes: string | null;
    status: string;
    created_at: string;
    user: {
        name: string;
        role: string;
    };
    sale_items: SaleItem[];
    total_items: number;
    total_profit?: number;
}

interface SaleShowProps {
    sale: Sale;
    [key: string]: unknown;
}

export default function SaleShow({ sale }: SaleShowProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
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

    const printInvoice = () => {
        window.print();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Transaksi - ${sale.invoice_number}`} />
            
            <div className="space-y-6 p-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Detail Transaksi</h1>
                    <div className="flex space-x-3">
                        <Button onClick={printInvoice} variant="outline">
                            🖨️ Cetak Invoice
                        </Button>
                        <Link href="/sales">
                            <Button variant="outline">
                                📋 Kembali ke Daftar
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Invoice Details */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{sale.invoice_number}</h2>
                                <p className="text-gray-600">{new Date(sale.created_at).toLocaleString('id-ID')}</p>
                            </div>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(sale.status)}`}>
                                {sale.status === 'completed' ? 'Selesai' : 
                                 sale.status === 'pending' ? 'Pending' : 'Batal'}
                            </span>
                        </div>

                        {/* Items Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Produk
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Qty
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Harga
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Diskon
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sale.sale_items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-4">
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {item.product.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        SKU: {item.product.sku}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-gray-900">
                                                {item.quantity}
                                            </td>
                                            <td className="px-4 py-4 text-gray-900">
                                                {formatCurrency(item.unit_price)}
                                            </td>
                                            <td className="px-4 py-4 text-gray-900">
                                                {item.discount_per_item > 0 ? formatCurrency(item.discount_per_item) : '-'}
                                            </td>
                                            <td className="px-4 py-4 font-medium text-gray-900">
                                                {formatCurrency(item.total_price)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div className="border-t mt-6 pt-4">
                            <div className="flex justify-end">
                                <div className="w-64 space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal:</span>
                                        <span className="font-medium">{formatCurrency(sale.subtotal)}</span>
                                    </div>
                                    {sale.discount_amount > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Diskon Total:</span>
                                            <span className="font-medium text-red-600">
                                                -{formatCurrency(sale.discount_amount)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                                        <span>Total:</span>
                                        <span className="text-green-600">{formatCurrency(sale.total_amount)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        {sale.notes && (
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-2">Catatan:</h4>
                                <p className="text-gray-700">{sale.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Sale Info */}
                    <div className="space-y-6">
                        {/* Payment Info */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Pembayaran</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Metode:</span>
                                    <div className="flex items-center">
                                        <span className="mr-2">
                                            {getPaymentMethodIcon(sale.payment_method)}
                                        </span>
                                        {sale.payment_method === 'cash' ? 'Tunai' : 'Transfer'}
                                    </div>
                                </div>
                                {sale.transfer_reference && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Referensi:</span>
                                        <span className="font-mono text-sm">{sale.transfer_reference}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Cashier Info */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Kasir</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Nama:</span>
                                    <span className="font-medium">{sale.user.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Peran:</span>
                                    <span className="capitalize">{sale.user.role}</span>
                                </div>
                            </div>
                        </div>

                        {/* Sale Summary */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Transaksi</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Item:</span>
                                    <span className="font-medium">{sale.total_items} pcs</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Jenis Produk:</span>
                                    <span className="font-medium">{sale.sale_items.length} jenis</span>
                                </div>
                                {(window as unknown as { auth?: { user?: { role: string } } }).auth?.user?.role === 'admin' && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Profit:</span>
                                        <span className="font-bold">{formatCurrency(sale.total_profit || 0)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print-area, .print-area * {
                        visibility: visible;
                    }
                    .print-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            `}</style>
        </AppLayout>
    );
}