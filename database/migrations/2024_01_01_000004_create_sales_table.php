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
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique()->comment('Unique invoice number');
            $table->foreignId('user_id')->constrained();
            $table->decimal('subtotal', 12, 2)->comment('Subtotal before discount');
            $table->decimal('discount_amount', 12, 2)->default(0)->comment('Total discount applied');
            $table->decimal('total_amount', 12, 2)->comment('Final total amount');
            $table->enum('payment_method', ['cash', 'transfer'])->comment('Payment method');
            $table->string('transfer_reference')->nullable()->comment('Transfer payment reference');
            $table->text('notes')->nullable()->comment('Additional notes');
            $table->enum('status', ['pending', 'completed', 'cancelled'])->default('pending')->comment('Sale status');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('invoice_number');
            $table->index('user_id');
            $table->index('payment_method');
            $table->index('status');
            $table->index(['status', 'created_at']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};