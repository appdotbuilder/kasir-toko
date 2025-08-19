<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Administrator',
            'email' => 'admin@kasir.app',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Create cashier user
        User::create([
            'name' => 'Kasir 1',
            'email' => 'kasir@kasir.app',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role' => 'kasir',
            'is_active' => true,
        ]);

        // Create additional cashier users
        User::create([
            'name' => 'Kasir 2',
            'email' => 'kasir2@kasir.app',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role' => 'kasir',
            'is_active' => true,
        ]);
    }
}