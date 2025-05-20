<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\KategoriProyekService;
use App\Services\ProyekService;
use App\Services\JadwalProyekService;
use App\Services\KomentarProyekService;
use App\Services\VisitorLogsService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {

        $this->app->singleton('kategori.proyek.service', function ($app) {
            return new KategoriProyekService();
        });

        $this->app->singleton('proyek.service', function ($app) {
            return new ProyekService();
        });

        $this->app->singleton('jadwal.proyek.service', function ($app) {
            return new JadwalProyekService();
        });

        $this->app->singleton('komentar.proyek.service', function ($app) {
            return new KomentarProyekService();
        });

        $this->app->singleton('visitor.logs', function ($app) {
            return new VisitorLogsService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
