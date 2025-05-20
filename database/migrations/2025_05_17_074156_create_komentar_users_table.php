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
         Schema::create('komentar_proyek', function (Blueprint $table) {
            $table->id();
            $table->text('isi');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('proyek_id')->constrained('proyek')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('komentar_proyek');
    }
};
