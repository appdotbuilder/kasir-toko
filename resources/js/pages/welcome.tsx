import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function Welcome() {
    return (
        <>
            <Head title="Aplikasi Kasir - Sistem POS Modern" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="flex justify-center items-center mb-6">
                            <div className="bg-indigo-600 rounded-full p-4 mr-4">
                                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
                                    🛒 Aplikasi Kasir
                                </h1>
                                <p className="text-xl md:text-2xl text-gray-600 mt-2">
                                    Sistem Point of Sale Modern untuk Toko Anda
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {/* Kasir Features */}
                        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                            <div className="text-center">
                                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                                    <span className="text-2xl">💳</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Kasir</h3>
                                <p className="text-gray-600 mb-4">Fitur lengkap untuk kasir</p>
                                <ul className="text-left text-sm text-gray-600 space-y-2">
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        Pencatatan penjualan cepat
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        Pencarian produk real-time
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        Kelola transaksi harian
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        Pembayaran cash & transfer
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Admin Features */}
                        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                            <div className="text-center">
                                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                                    <span className="text-2xl">👨‍💼</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Admin</h3>
                                <p className="text-gray-600 mb-4">Kontrol penuh sistem</p>
                                <ul className="text-left text-sm text-gray-600 space-y-2">
                                    <li className="flex items-center">
                                        <span className="text-blue-500 mr-2">✓</span>
                                        Kelola produk & stok
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-blue-500 mr-2">✓</span>
                                        Manajemen pengguna
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-blue-500 mr-2">✓</span>
                                        Laporan penjualan lengkap
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-blue-500 mr-2">✓</span>
                                        Analisis profit & loss
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Payment Features */}
                        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                            <div className="text-center">
                                <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                                    <span className="text-2xl">💰</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Pembayaran</h3>
                                <p className="text-gray-600 mb-4">Fleksibel & aman</p>
                                <ul className="text-left text-sm text-gray-600 space-y-2">
                                    <li className="flex items-center">
                                        <span className="text-purple-500 mr-2">✓</span>
                                        Pembayaran tunai
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-purple-500 mr-2">✓</span>
                                        Transfer bank
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-purple-500 mr-2">✓</span>
                                        Sistem diskon fleksibel
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-purple-500 mr-2">✓</span>
                                        Invoice otomatis
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Key Features */}
                    <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                            🚀 Fitur Unggulan
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">📊 Manajemen Produk</h4>
                                <ul className="space-y-2 text-gray-600">
                                    <li>• Kelola harga pokok dan harga jual</li>
                                    <li>• Monitoring stok real-time</li>
                                    <li>• Alert stok minimum</li>
                                    <li>• Kategorisasi produk</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">📈 Laporan & Analisis</h4>
                                <ul className="space-y-2 text-gray-600">
                                    <li>• Laporan penjualan harian/bulanan</li>
                                    <li>• Analisis produk terlaris</li>
                                    <li>• Tracking profit margin</li>
                                    <li>• Performa kasir individual</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Demo Accounts */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-8 text-white mb-12">
                        <h2 className="text-2xl font-bold text-center mb-6">🎯 Akun Demo</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white/10 rounded-lg p-4">
                                <h4 className="font-semibold mb-2">👨‍💼 Admin</h4>
                                <p className="text-sm opacity-90">Email: admin@kasir.app</p>
                                <p className="text-sm opacity-90">Password: password</p>
                            </div>
                            <div className="bg-white/10 rounded-lg p-4">
                                <h4 className="font-semibold mb-2">💳 Kasir</h4>
                                <p className="text-sm opacity-90">Email: kasir@kasir.app</p>
                                <p className="text-sm opacity-90">Password: password</p>
                            </div>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="text-center">
                        <div className="space-x-4">
                            <Link href="/login">
                                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-lg">
                                    🔑 Masuk ke Sistem
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button variant="outline" size="lg" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-8 py-3 text-lg">
                                    📝 Daftar Akun Baru
                                </Button>
                            </Link>
                        </div>
                        <p className="text-gray-500 mt-4">
                            Mulai kelola toko Anda dengan sistem kasir modern
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-16 text-center text-gray-500">
                        <p>&copy; 2024 Aplikasi Kasir. Sistem POS terpercaya untuk bisnis Anda.</p>
                    </div>
                </div>
            </div>
        </>
    );
}