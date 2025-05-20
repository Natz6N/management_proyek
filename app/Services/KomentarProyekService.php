<?php

namespace App\Services;

use App\Models\KomentarProyek;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class KomentarProyekService
{
    /**
     * Get all comments
     *
     * @return Collection
     */
    public function getAll(): Collection
    {
        return KomentarProyek::all();
    }

    /**
     * Get paginated comments
     *
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getPaginated(int $perPage = 10): LengthAwarePaginator
    {
        return KomentarProyek::paginate($perPage);
    }

    /**
     * Find comment by ID
     *
     * @param int $id
     * @return KomentarProyek|null
     */
    public function findById(int $id): ?KomentarProyek
    {
        return KomentarProyek::find($id);
    }

    /**
     * Create a new comment
     *
     * @param array $data
     * @return KomentarProyek
     */
    public function create(array $data): KomentarProyek
    {
        return KomentarProyek::create($data);
    }

    /**
     * Update comment
     *
     * @param int $id
     * @param array $data
     * @return KomentarProyek|null
     */
    public function update(int $id, array $data): ?KomentarProyek
    {
        $komentar = $this->findById($id);

        if (!$komentar) {
            return null;
        }

        $komentar->update($data);
        return $komentar;
    }

    /**
     * Delete comment
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool
    {
        $komentar = $this->findById($id);

        if (!$komentar) {
            return false;
        }

        return $komentar->delete();
    }

    /**
     * Get comments by project ID
     *
     * @param int $proyekId
     * @return Collection
     */
    public function getByProyek(int $proyekId): Collection
    {
        return KomentarProyek::where('proyek_id', $proyekId)->get();
    }

    /**
     * Get comments by project ID with pagination
     *
     * @param int $proyekId
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getByProyekPaginated(int $proyekId, int $perPage = 10): LengthAwarePaginator
    {
        return KomentarProyek::where('proyek_id', $proyekId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get comments by user ID
     *
     * @param int $userId
     * @return Collection
     */
    public function getByUser(int $userId): Collection
    {
        return KomentarProyek::where('user_id', $userId)->get();
    }

    /**
     * Get comments by user ID with pagination
     *
     * @param int $userId
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getByUserPaginated(int $userId, int $perPage = 10): LengthAwarePaginator
    {
        return KomentarProyek::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get comment with its user and project
     *
     * @param int $id
     * @return KomentarProyek|null
     */
    public function getWithRelations(int $id): ?KomentarProyek
    {
        return KomentarProyek::with(['user', 'proyek'])->find($id);
    }

    /**
     * Get recent comments
     *
     * @param int $limit
     * @return Collection
     */
    public function getRecent(int $limit = 5): Collection
    {
        return KomentarProyek::with(['user', 'proyek'])
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }
}
