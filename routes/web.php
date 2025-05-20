<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProyekController;
Route::get('/', [ProyekController::class , 'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::middleware('Admin')->group(function () {

    });
    Route::middleware('User')->group(function () {

    });
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
