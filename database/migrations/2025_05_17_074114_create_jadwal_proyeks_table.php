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
            Schema::create('jadwal', function (Blueprint $table) {
                $table->id();
                $table->string('nama');
                $table->text('deskripsi')->nullable();
                $table->dateTime('start_time');
                $table->dateTime('end_time')->nullable();
                $table->foreignId('proyek_id')->constrained('proyek')->onDelete('cascade');
                $table->timestamps();
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jadwal_proyeks');
    }
};
