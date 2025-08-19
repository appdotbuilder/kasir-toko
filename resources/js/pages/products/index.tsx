import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Head, Link, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Produk', href: '/products' },
];

interface Product {
    id: number;
    name: string;
    sku: string;
    cost_price: number;
    selling_price: number;
    stock_quantity: number;
    min_stock: number;
    category: string | null;
    is_active: boolean;
    profit_margin: number;
    profit_percentage: number;
    is_low_stock: boolean;
}

interface ProductsIndexProps {
    products: {
        data: Product[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        meta: { from: number; to: number; total: number };
    };
    categories: string[];
    filters: {
        search?: string;
        category?: string;
        low_stock?: boolean;
    };
    [key: string]: unknown;
}

export default function ProductsIndex({ products, categories, filters }: ProductsIndexProps) {
    const [searchFilters, setSearchFilters] = useState(filters);
    const user = (window as unknown as { auth?: { user?: { role: string } } }).auth?.user;
    const isAdmin = user?.role === 'admin';

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleFilter = () => {
        router.get('/products', searchFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilters = () => {
        setSearchFilters({});
        router.get('/products');
    };

    const handleDelete = (product: Product) => {
        if (confirm(`Apakah Anda yakin ingin menghapus produk "${product.name}"?`)) {
            router.delete(`/products/${product.id}`, {
                onSuccess: () => {
                    // Success handled by redirect
                },
                onError: () => {
                    alert('Terjadi kesalahan saat menghapus produk.');
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Produk" />
            
            <div className="space-y-6 p-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Daftar Produk</h1>
                    {isAdmin && (
                        <Link href="/products/create">
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                ➕ Tambah Produk
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Filters */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cari Produk
                            </label>
                            <input
                                type="text"
                                value={searchFilters.search || ''}
                                onChange={(e) => setSearchFilters({ ...searchFilters, search: e.target.value })}
                                placeholder="Nama produk atau SKU..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kategori
                            </label>
                            <select
                                value={searchFilters.category || ''}
                                onChange={(e) => setSearchFilters({ ...searchFilters, category: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Semua Kategori</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={searchFilters.low_stock || false}
                                    onChange={(e) => setSearchFilters({ ...searchFilters, low_stock: e.target.checked })}
                                    className="mr-2"
                                />
                                <span className="text-sm text-gray-700">Hanya stok menipis</span>
                            </label>
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

                {/* Products Grid/Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Produk
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Harga
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stok
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kategori
                                    </th>
                                    {isAdmin && (
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Profit
                                        </th>
                                    )}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.data.map((product) => (
                                    <tr key={product.id} className={`hover:bg-gray-50 ${product.is_low_stock ? 'bg-red-50' : ''}`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {product.name}
                                                    {product.is_low_stock && (
                                                        <span className="ml-2 text-red-500">⚠️</span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="font-bold text-green-600">
                                                    {formatCurrency(product.selling_price)}
                                                </div>
                                                {isAdmin && (
                                                    <div className="text-sm text-gray-500">
                                                        Pokok: {formatCurrency(product.cost_price)}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`font-medium ${product.is_low_stock ? 'text-red-600' : 'text-gray-900'}`}>
                                                {product.stock_quantity} pcs
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Min: {product.min_stock} pcs
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {product.category ? (
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {product.category}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        {isAdmin && (
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-green-600 font-medium">
                                                    {formatCurrency(product.profit_margin)}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {product.profit_percentage.toFixed(1)}%
                                                </div>
                                            </td>
                                        )}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                product.is_active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {product.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <Link
                                                href={`/products/${product.id}`}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Detail
                                            </Link>
                                            {isAdmin && (
                                                <>
                                                    <Link
                                                        href={`/products/${product.id}/edit`}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Hapus
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination - Same as Sales index */}
                    {products.links && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{products.meta.from || 0}</span> to{' '}
                                        <span className="font-medium">{products.meta.to || 0}</span> of{' '}
                                        <span className="font-medium">{products.meta.total}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        {products.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`relative inline-flex items-center px-2 py-2 border text-sm font-medium ${
                                                    link.active
                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                } ${index === 0 ? 'rounded-l-md' : ''} ${
                                                    index === products.links.length - 1 ? 'rounded-r-md' : ''
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
                {products.data.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Produk</h3>
                        <p className="text-gray-600 mb-6">Mulai dengan menambahkan produk pertama Anda</p>
                        {isAdmin && (
                            <Link href="/products/create">
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    Tambah Produk Baru
                                </Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}