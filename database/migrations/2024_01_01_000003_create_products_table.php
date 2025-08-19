<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Product name');
            $table->string('sku')->unique()->comment('Stock Keeping Unit');
            $table->text('description')->nullable()->comment('Product description');
            $table->decimal('cost_price', 12, 2)->comment('Cost price (harga pokok)');
            $table->decimal('selling_price', 12, 2)->comment('Selling price (harga jual)');
            $table->integer('stock_quantity')->default(0)->comment('Current stock quantity');
            $table->integer('min_stock')->default(5)->comment('Minimum stock alert level');
            $table->string('category')->nullable()->comment('Product category');
            $table->boolean('is_active')->default(true)->comment('Product status');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('name');
            $table->index('sku');
            $table->index('category');
            $table->index('is_active');
            $table->index(['is_active', 'stock_quantity']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};