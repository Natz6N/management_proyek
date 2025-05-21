<?php

namespace App\Services;

use App\Models\KategoriProyek;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class KategoriProyekService extends BaseService
{
    /**
     * Create a new service instance.
     */
    public function __construct()
    {
        $this->model = new KategoriProyek();
    }

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
    public function findById(int $id): ?Model
    {
        return KategoriProyek::find($id);
    }

    /**
     * Create a new project category
     *
     * @param array $data
     * @return KategoriProyek
     */
    public function create(array $data): Model
    {
        return KategoriProyek::create($data);
    }

    /**
     * Update project category
     *
     * @param int $id
     * @param array $data
     * @return Model
     */
    public function update(int $id, array $data): Model
    {
        $kategori = $this->findById($id);

        if (!$kategori) {
            throw new \Illuminate\Database\Eloquent\ModelNotFoundException("Category with ID {$id} not found");
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
            throw new \Illuminate\Database\Eloquent\ModelNotFoundException("Category with ID {$id} not found");
        }

        return $kategori->delete();
    }

    /**
     * Get category with its projects
     *
     * @param int $id
     * @return KategoriProyek|null
     */
    public function getWithProyek(int $id): ?Model
    {
        return KategoriProyek::with('proyek')->find($id);
    }

    /**
     * Get popular categories based on the number of projects
     *
     * @param int $limit
     * @return Collection
     */
    public function getPopular(int $limit = 6): Collection
    {
        // First approach: get categories with the most projects
        return KategoriProyek::withCount('proyek')
            ->orderBy('proyek_count', 'desc')
            ->limit($limit)
            ->get();

        // Alternative approach using visitor logs if implemented
        // return KategoriProyek::join('visitor_logs', function($join) {
        //     $join->on('kategori_proyeks.id', '=', 'visitor_logs.metadata->category_id')
        //         ->where('visitor_logs.path', '=', 'browse');
        // })
        // ->select('kategori_proyeks.*', \DB::raw('count(visitor_logs.id) as visits'))
        // ->groupBy('kategori_proyeks.id')
        // ->orderBy('visits', 'desc')
        // ->limit($limit)
        // ->get();
    }

    /**
     * Search for categories by name
     *
     * @param string $query The search query
     * @param int $limit Maximum number of results to return
     * @return Collection
     */
    public function search(string $query, int $limit = 6): Collection
    {
        return KategoriProyek::where('nama', 'like', "%{$query}%")
            ->orWhere('deskripsi', 'like', "%{$query}%")
            ->limit($limit)
            ->get();
    }
}
