import React, { useState, useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Head, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Transaksi', href: '/sales' },
    { title: 'Buat Transaksi', href: '/sales/create' },
];

interface Product {
    id: number;
    name: string;
    sku: string;
    selling_price: number;
    stock_quantity: number;
}

interface CartItem {
    product_id: number;
    product: Product;
    quantity: number;
    unit_price: number;
    discount_per_item: number;
}

interface CreateSaleProps {
    products: Product[];
    [key: string]: unknown;
}

export default function CreateSale({ products }: CreateSaleProps) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer'>('cash');
    const [transferReference, setTransferReference] = useState('');
    const [globalDiscount, setGlobalDiscount] = useState(0);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Filter products based on search
    const filteredProducts = useMemo(() => {
        return products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase())
        ).filter(product => product.stock_quantity > 0);
    }, [products, searchTerm]);

    // Add product to cart
    const addToCart = (product: Product) => {
        const existingItem = cart.find(item => item.product_id === product.id);
        
        if (existingItem) {
            setCart(cart.map(item =>
                item.product_id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, {
                product_id: product.id,
                product: product,
                quantity: 1,
                unit_price: product.selling_price,
                discount_per_item: 0,
            }]);
        }
        setSearchTerm('');
    };

    // Update cart item
    const updateCartItem = (productId: number, field: keyof CartItem, value: number) => {
        setCart(cart.map(item =>
            item.product_id === productId
                ? { ...item, [field]: value }
                : item
        ));
    };

    // Remove from cart
    const removeFromCart = (productId: number) => {
        setCart(cart.filter(item => item.product_id !== productId));
    };

    // Calculate totals
    const subtotal = useMemo(() => {
        return cart.reduce((total, item) => {
            return total + ((item.unit_price - item.discount_per_item) * item.quantity);
        }, 0);
    }, [cart]);

    const totalAmount = subtotal - globalDiscount;

    // Submit sale
    const handleSubmit = async () => {
        if (cart.length === 0) {
            alert('Keranjang belanja kosong!');
            return;
        }

        if (paymentMethod === 'transfer' && !transferReference.trim()) {
            alert('Referensi transfer wajib diisi untuk pembayaran transfer!');
            return;
        }

        setLoading(true);
        
        const saleData = {
            items: cart.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.unit_price,
                discount_per_item: item.discount_per_item,
            })),
            payment_method: paymentMethod,
            transfer_reference: paymentMethod === 'transfer' ? transferReference : null,
            discount_amount: globalDiscount,
            notes: notes.trim() || null,
        };

        router.post('/sales', saleData, {
            onSuccess: () => {
                // Success handled by redirect from controller
            },
            onError: (errors) => {
                console.error('Sale creation error:', errors);
                alert('Terjadi kesalahan saat membuat transaksi. Silakan coba lagi.');
            },
            onFinish: () => {
                setLoading(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Transaksi Baru" />
            
            <div className="space-y-6 p-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Transaksi Baru</h1>
                    <div className="text-lg font-semibold bg-blue-100 px-4 py-2 rounded-lg">
                        Total: {formatCurrency(totalAmount)}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Product Selection */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">🔍 Pilih Produk</h2>
                        
                        {/* Search */}
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Cari produk (nama atau SKU)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Product List */}
                        <div className="max-h-96 overflow-y-auto space-y-2">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    onClick={() => addToCart(product)}
                                    className="p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium text-gray-900">{product.name}</p>
                                            <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-green-600">
                                                {formatCurrency(product.selling_price)}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Stok: {product.stock_quantity}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {filteredProducts.length === 0 && searchTerm && (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="text-4xl mb-2">🔍</div>
                                    <p>Produk tidak ditemukan</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Shopping Cart */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">🛒 Keranjang Belanja</h2>
                        
                        {cart.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <div className="text-4xl mb-2">🛒</div>
                                <p>Keranjang kosong</p>
                                <p className="text-sm">Pilih produk untuk memulai transaksi</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Cart Items */}
                                <div className="max-h-64 overflow-y-auto space-y-3">
                                    {cart.map((item) => (
                                        <div key={item.product_id} className="p-3 bg-gray-50 rounded-lg">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">{item.product.name}</p>
                                                    <p className="text-sm text-gray-600">{item.product.sku}</p>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.product_id)}
                                                    className="text-red-500 hover:text-red-700 text-xl"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                            
                                            <div className="grid grid-cols-3 gap-2">
                                                <div>
                                                    <label className="text-xs text-gray-500">Qty</label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max={item.product.stock_quantity}
                                                        value={item.quantity}
                                                        onChange={(e) => updateCartItem(item.product_id, 'quantity', parseInt(e.target.value) || 1)}
                                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500">Harga</label>
                                                    <input
                                                        type="number"
                                                        value={item.unit_price}
                                                        onChange={(e) => updateCartItem(item.product_id, 'unit_price', parseFloat(e.target.value) || 0)}
                                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500">Diskon</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={item.discount_per_item}
                                                        onChange={(e) => updateCartItem(item.product_id, 'discount_per_item', parseFloat(e.target.value) || 0)}
                                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="text-right mt-2">
                                                <span className="font-bold text-green-600">
                                                    {formatCurrency((item.unit_price - item.discount_per_item) * item.quantity)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="border-t pt-4 space-y-2">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span className="font-medium">{formatCurrency(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Diskon Total:</span>
                                        <input
                                            type="number"
                                            min="0"
                                            max={subtotal}
                                            value={globalDiscount}
                                            onChange={(e) => setGlobalDiscount(parseFloat(e.target.value) || 0)}
                                            className="px-2 py-1 text-sm border border-gray-300 rounded w-24 text-right"
                                        />
                                    </div>
                                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                                        <span>Total:</span>
                                        <span className="text-green-600">{formatCurrency(totalAmount)}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Payment & Checkout */}
                {cart.length > 0 && (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">💳 Pembayaran & Checkout</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Payment Method */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Metode Pembayaran
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="cash"
                                            checked={paymentMethod === 'cash'}
                                            onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'transfer')}
                                            className="mr-2"
                                        />
                                        <span>💵 Tunai</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="transfer"
                                            checked={paymentMethod === 'transfer'}
                                            onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'transfer')}
                                            className="mr-2"
                                        />
                                        <span>🏦 Transfer</span>
                                    </label>
                                </div>

                                {paymentMethod === 'transfer' && (
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Referensi Transfer *
                                        </label>
                                        <input
                                            type="text"
                                            value={transferReference}
                                            onChange={(e) => setTransferReference(e.target.value)}
                                            placeholder="Masukkan referensi transfer..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Catatan (Opsional)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Catatan untuk transaksi ini..."
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <div className="mt-6 text-center">
                            <Button
                                onClick={handleSubmit}
                                disabled={loading || cart.length === 0}
                                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-8 py-3 text-lg"
                            >
                                {loading ? '⏳ Memproses...' : '✅ Selesaikan Transaksi'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}