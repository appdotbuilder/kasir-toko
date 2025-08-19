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
        Schema::create('sale_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sale_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained();
            $table->integer('quantity')->comment('Quantity sold');
            $table->decimal('unit_price', 12, 2)->comment('Unit price at time of sale');
            $table->decimal('discount_per_item', 12, 2)->default(0)->comment('Discount per item');
            $table->decimal('total_price', 12, 2)->comment('Total price for this item');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('sale_id');
            $table->index('product_id');
            $table->index(['sale_id', 'product_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sale_items');
    }
};