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
         Schema::create('proyek', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->string('image')->nullable();
            $table->string('slug')->unique();
            $table->string('link')->nullable();
            // $table->string('status')->default('draft');
            $table->text('deskripsi')->nullable();
            $table->foreignId('kategori_proyek_id')->constrained('kategori_proyek')->onDelete('cascade');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proyeks');
    }
};
