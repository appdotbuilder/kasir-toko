import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Head, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Produk', href: '/products' },
    { title: 'Tambah Produk', href: '/products/create' },
];

interface ProductFormData {
    name: string;
    sku: string;
    description: string;
    cost_price: string;
    selling_price: string;
    stock_quantity: string;
    min_stock: string;
    category: string;
    is_active: boolean;
    [key: string]: unknown;
}

export default function CreateProduct() {
    const [data, setData] = useState<ProductFormData>({
        name: '',
        sku: '',
        description: '',
        cost_price: '',
        selling_price: '',
        stock_quantity: '0',
        min_stock: '5',
        category: '',
        is_active: true,
    });
    
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        router.post('/products', data as unknown as Record<string, string | number | boolean>, {
            onSuccess: () => {
                // Redirect handled by controller
            },
            onError: (responseErrors) => {
                setErrors(responseErrors as Record<string, string>);
            },
            onFinish: () => {
                setLoading(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Produk Baru" />
            
            <div className="space-y-6 p-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Tambah Produk Baru</h1>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Produk *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData({ ...data, name: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Masukkan nama produk"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                )}
                            </div>

                            {/* SKU */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    SKU *
                                </label>
                                <input
                                    type="text"
                                    value={data.sku}
                                    onChange={(e) => setData({ ...data, sku: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.sku ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Masukkan SKU produk"
                                />
                                {errors.sku && (
                                    <p className="text-red-500 text-sm mt-1">{errors.sku}</p>
                                )}
                            </div>

                            {/* Cost Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Harga Pokok *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.cost_price}
                                    onChange={(e) => setData({ ...data, cost_price: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.cost_price ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="0"
                                />
                                {errors.cost_price && (
                                    <p className="text-red-500 text-sm mt-1">{errors.cost_price}</p>
                                )}
                            </div>

                            {/* Selling Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Harga Jual *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.selling_price}
                                    onChange={(e) => setData({ ...data, selling_price: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.selling_price ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="0"
                                />
                                {errors.selling_price && (
                                    <p className="text-red-500 text-sm mt-1">{errors.selling_price}</p>
                                )}
                            </div>

                            {/* Stock Quantity */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Stok Awal *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.stock_quantity}
                                    onChange={(e) => setData({ ...data, stock_quantity: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.stock_quantity ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.stock_quantity && (
                                    <p className="text-red-500 text-sm mt-1">{errors.stock_quantity}</p>
                                )}
                            </div>

                            {/* Min Stock */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Minimum Stok *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.min_stock}
                                    onChange={(e) => setData({ ...data, min_stock: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.min_stock ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.min_stock && (
                                    <p className="text-red-500 text-sm mt-1">{errors.min_stock}</p>
                                )}
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kategori
                            </label>
                            <input
                                type="text"
                                value={data.category}
                                onChange={(e) => setData({ ...data, category: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Masukkan kategori produk"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Deskripsi
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData({ ...data, description: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Deskripsi produk..."
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData({ ...data, is_active: e.target.checked })}
                                    className="mr-2"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    Produk aktif
                                </span>
                            </label>
                        </div>

                        {/* Buttons */}
                        <div className="flex space-x-3 pt-6 border-t">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? '⏳ Menyimpan...' : '💾 Simpan Produk'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.visit('/products')}
                            >
                                ❌ Batal
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}