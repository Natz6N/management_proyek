<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WebController;
use App\Http\Controllers\DashboardController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::middleware('role:admin')->prefix('dashboard')->group(function () {
        // Main dashboard
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

        // Project routes
        Route::prefix('projects')->name('dashboard.projects.')->group(function () {
            Route::get('/', [DashboardController::class, 'projectIndex'])->name('index');
            Route::get('/create', [DashboardController::class, 'projectCreate'])->name('create');
            Route::post('/', [DashboardController::class, 'projectStore'])->name('store');
            Route::get('/{id}', [DashboardController::class, 'projectShow'])->name('show');
            Route::get('/{id}/edit', [DashboardController::class, 'projectEdit'])->name('edit');
            Route::put('/{id}', [DashboardController::class, 'projectUpdate'])->name('update');
            Route::delete('/{id}', [DashboardController::class, 'projectDestroy'])->name('destroy');
        });

        // Category routes
        Route::prefix('categories')->name('dashboard.categories.')->group(function () {
            Route::get('/', [DashboardController::class, 'categoryIndex'])->name('index');
            Route::get('/create', [DashboardController::class, 'categoryCreate'])->name('create');
            Route::post('/', [DashboardController::class, 'categoryStore'])->name('store');
            Route::get('/{id}', [DashboardController::class, 'categoryShow'])->name('show');
            Route::get('/{id}/edit', [DashboardController::class, 'categoryEdit'])->name('edit');
            Route::put('/{id}', [DashboardController::class, 'categoryUpdate'])->name('update');
            Route::delete('/{id}', [DashboardController::class, 'categoryDestroy'])->name('destroy');
        });

        // Schedule routes
        Route::prefix('schedules')->name('dashboard.schedules.')->group(function () {
            Route::get('/', [DashboardController::class, 'scheduleIndex'])->name('index');
            Route::get('/create', [DashboardController::class, 'scheduleCreate'])->name('create');
            Route::post('/', [DashboardController::class, 'scheduleStore'])->name('store');
            Route::get('/{id}', [DashboardController::class, 'scheduleShow'])->name('show');
            Route::get('/{id}/edit', [DashboardController::class, 'scheduleEdit'])->name('edit');
            Route::put('/{id}', [DashboardController::class, 'scheduleUpdate'])->name('update');
            Route::delete('/{id}', [DashboardController::class, 'scheduleDestroy'])->name('destroy');
        });
    });

    // Route::middleware('role:user')->group(function () {
    // });
});
Route::get('/', [WebController::class, 'index'])->name('home');
Route::get('/browse', [WebController::class, 'browse'])->name('browse');
Route::get('/show/{slug}', [WebController::class, 'showProyek'])->name('showProyek');
Route::get('/showjadwal/{id}', [WebController::class, 'showJadwal'])->name('showJadwal');
Route::post('/contact', [WebController::class, 'contact'])->name('contact');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
