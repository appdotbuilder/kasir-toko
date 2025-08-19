<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Product>
     */
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $costPrice = fake()->randomFloat(2, 5000, 50000);
        $markup = fake()->randomFloat(2, 1.2, 2.5); // 20% to 150% markup
        
        return [
            'name' => fake()->words(3, true),
            'sku' => 'SKU-' . fake()->unique()->numerify('######'),
            'description' => fake()->sentence(),
            'cost_price' => $costPrice,
            'selling_price' => $costPrice * $markup,
            'stock_quantity' => fake()->numberBetween(0, 100),
            'min_stock' => fake()->numberBetween(5, 20),
            'category' => fake()->randomElement(['Makanan', 'Minuman', 'Snack', 'Elektronik', 'Kesehatan', 'Kecantikan']),
            'is_active' => fake()->boolean(90), // 90% active
        ];
    }

    /**
     * Indicate that the product is out of stock.
     */
    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => 0,
        ]);
    }

    /**
     * Indicate that the product has low stock.
     */
    public function lowStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => fake()->numberBetween(1, $attributes['min_stock'] ?? 5),
        ]);
    }
}