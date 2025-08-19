<?php

namespace Database\Factories;

use App\Models\Sale;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Sale>
 */
class SaleFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Sale>
     */
    protected $model = Sale::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = fake()->randomFloat(2, 10000, 500000);
        $discountAmount = fake()->boolean(30) ? fake()->randomFloat(2, 0, $subtotal * 0.1) : 0;
        $paymentMethod = fake()->randomElement(['cash', 'transfer']);
        
        return [
            'invoice_number' => 'INV-' . fake()->date('Ymd') . '-' . fake()->numerify('####'),
            'user_id' => User::factory(),
            'subtotal' => $subtotal,
            'discount_amount' => $discountAmount,
            'total_amount' => $subtotal - $discountAmount,
            'payment_method' => $paymentMethod,
            'transfer_reference' => $paymentMethod === 'transfer' ? fake()->bothify('TRF-####-????') : null,
            'notes' => fake()->optional(0.3)->sentence(),
            'status' => fake()->randomElement(['completed', 'pending', 'cancelled']),
        ];
    }

    /**
     * Indicate that the sale is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
        ]);
    }

    /**
     * Indicate that the sale is paid by cash.
     */
    public function cash(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_method' => 'cash',
            'transfer_reference' => null,
        ]);
    }

    /**
     * Indicate that the sale is paid by transfer.
     */
    public function transfer(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_method' => 'transfer',
            'transfer_reference' => fake()->bothify('TRF-####-????'),
        ]);
    }
}