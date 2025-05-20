<?php

namespace App\Services;

use App\Models\Proyek;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ProyekService
{
    /**
     * Create a new proyek with image handling
     *
     * @param array $data
     * @return Proyek
     */
    public function create(array $data): Proyek
    {
        if (!isset($data['slug'])) {
            $data['slug'] = Str::slug($data['judul']);
        }

        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $data['image'] = $this->uploadImage($data['image']);
        }

        return Proyek::create($data);
    }

    /**
     * Update proyek with image handling
     *
     * @param int $id
     * @param array $data
     * @return Proyek
     */
    public function update(int $id, array $data): Proyek
    {
        $proyek = Proyek::findOrFail($id);

        if (isset($data['judul']) && !isset($data['slug'])) {
            $data['slug'] = Str::slug($data['judul']);
        }

        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            if ($proyek->image) {
                Storage::disk('public')->delete('proyek/' . basename($proyek->image));
            }

            $data['image'] = $this->uploadImage($data['image']);
        }

        $proyek->update($data);
        return $proyek;
    }

    /**
     * Delete proyek and its image
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool
    {
        $proyek = Proyek::findOrFail($id);

        if ($proyek->image) {
            Storage::disk('public')->delete('proyek/' . basename($proyek->image));
        }

        return $proyek->delete();
    }

    /**
     * Upload image and return public path
     *
     * @param UploadedFile $image
     * @return string
     */
    protected function uploadImage(UploadedFile $image): string
    {
        $filename = time() . '_' . Str::slug(pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $image->getClientOriginalExtension();
        $path = $image->storeAs('proyek', $filename, 'public');
        return Storage::url($path);
    }

    /**
     * Find proyek by slug
     *
     * @param string $slug
     * @return Proyek|null
     */
    public function findBySlug(string $slug): ?Proyek
    {
        return Proyek::where('slug', $slug)->first();
    }

    /**
     * Get proyek with kategori relation
     */
    public function findWithKategori(int $id): ?Proyek
    {
        return Proyek::with('kategori')->find($id);
    }

    /**
     * Get proyek with jadwal relation
     */
    public function findWithJadwal(int $id): ?Proyek
    {
        return Proyek::with('jadwal')->find($id);
    }

    /**
     * Get proyek with komentar relation
     */
    public function findWithKomentar(int $id): ?Proyek
    {
        return Proyek::with(['komentar' => function ($query) {
            $query->with('user')->orderBy('created_at', 'desc');
        }])->find($id);
    }

    /**
     * Get proyek with all related models
     */
    public function findWithAllRelations(int $id): ?Proyek
    {
        return Proyek::with(['kategori', 'jadwal', 'komentar.user'])->find($id);
    }

    /**
     * Get all proyek by kategori
     */
    public function getByKategori(int $kategoriId): Collection
    {
        return Proyek::where('kategori_proyek_id', $kategoriId)->get();
    }

    /**
     * Paginate proyek by kategori
     */
    public function paginateByKategori(int $kategoriId, int $perPage = 15): LengthAwarePaginator
    {
        return Proyek::where('kategori_proyek_id', $kategoriId)->paginate($perPage);
    }
}
