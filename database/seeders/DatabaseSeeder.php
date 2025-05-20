<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

            User::create([
            'name' => 'Natzsixn',
            'username' => 'Natzsixn',
            'email' => 'Natz@gmail.com',
            'role' => 'admin',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
        ]);
            User::create([
            'name' => 'user',
            'username' => 'user',
            'email' => 'user@gmail.com',
            'role' => 'user',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
        ]);
    }
}
