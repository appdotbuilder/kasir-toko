<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create sample products
        Product::create([
            'name' => 'Indomie Goreng',
            'sku' => 'FOOD-001',
            'description' => 'Mie instan rasa ayam goreng',
            'cost_price' => 2500.00,
            'selling_price' => 3500.00,
            'stock_quantity' => 100,
            'min_stock' => 20,
            'category' => 'Makanan',
            'is_active' => true,
        ]);

        Product::create([
            'name' => 'Coca Cola 330ml',
            'sku' => 'DRINK-001',
            'description' => 'Minuman bersoda cola',
            'cost_price' => 3000.00,
            'selling_price' => 5000.00,
            'stock_quantity' => 50,
            'min_stock' => 10,
            'category' => 'Minuman',
            'is_active' => true,
        ]);

        Product::create([
            'name' => 'Chitato Sapi Panggang',
            'sku' => 'SNACK-001',
            'description' => 'Keripik kentang rasa sapi panggang',
            'cost_price' => 8000.00,
            'selling_price' => 12000.00,
            'stock_quantity' => 30,
            'min_stock' => 5,
            'category' => 'Snack',
            'is_active' => true,
        ]);

        Product::create([
            'name' => 'Panadol Extra',
            'sku' => 'HEALTH-001',
            'description' => 'Obat sakit kepala dan demam',
            'cost_price' => 15000.00,
            'selling_price' => 20000.00,
            'stock_quantity' => 25,
            'min_stock' => 5,
            'category' => 'Kesehatan',
            'is_active' => true,
        ]);

        Product::create([
            'name' => 'Baterai AA Alkaline',
            'sku' => 'ELEC-001',
            'description' => 'Baterai alkaline ukuran AA',
            'cost_price' => 5000.00,
            'selling_price' => 8000.00,
            'stock_quantity' => 3, // Low stock
            'min_stock' => 10,
            'category' => 'Elektronik',
            'is_active' => true,
        ]);

        // Create additional random products
        Product::factory(20)->create();
    }
}