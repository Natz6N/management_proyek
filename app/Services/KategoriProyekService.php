<?php

namespace App\Services;

use App\Models\KategoriProyek;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class KategoriProyekService
{
    /**
     * Get all project categories
     *
     * @return Collection
     */
    public function getAll(): Collection
    {
        return KategoriProyek::all();
    }

    /**
     * Get paginated project categories
     *
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getPaginated(int $perPage = 10): LengthAwarePaginator
    {
        return KategoriProyek::paginate($perPage);
    }

    /**
     * Find project category by ID
     *
     * @param int $id
     * @return KategoriProyek|null
     */
    public function findById(int $id): ?KategoriProyek
    {
        return KategoriProyek::find($id);
    }

    /**
     * Create a new project category
     *
     * @param array $data
     * @return KategoriProyek
     */
    public function create(array $data): KategoriProyek
    {
        return KategoriProyek::create($data);
    }

    /**
     * Update project category
     *
     * @param int $id
     * @param array $data
     * @return KategoriProyek|null
     */
    public function update(int $id, array $data): ?KategoriProyek
    {
        $kategori = $this->findById($id);

        if (!$kategori) {
            return null;
        }

        $kategori->update($data);
        return $kategori;
    }

    /**
     * Delete project category
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool
    {
        $kategori = $this->findById($id);

        if (!$kategori) {
            return false;
        }

        return $kategori->delete();
    }

    /**
     * Get category with its projects
     *
     * @param int $id
     * @return KategoriProyek|null
     */
    public function getWithProyek(int $id): ?KategoriProyek
    {
        return KategoriProyek::with('proyek')->find($id);
    }
}
