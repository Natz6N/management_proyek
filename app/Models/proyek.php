<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class proyek extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'proyek';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'judul',
        'image',
        'slug',
        'link',
        'deskripsi',
        'kategori_proyek_id',
        'start_date',
        'end_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    /**
     * Get the category that owns the project
     */
    public function kategori()
    {
        return $this->belongsTo(KategoriProyek::class, 'kategori_proyek_id');
    }

    /**
     * Get all schedules for this project
     */
    public function jadwal()
    {
        return $this->hasMany(JadwalProyek::class, 'proyek_id');
    }

    /**
     * Get all comments for this project
     */
    public function komentar()
    {
        return $this->hasMany(KomentarProyek::class, 'proyek_id');
    }
}
