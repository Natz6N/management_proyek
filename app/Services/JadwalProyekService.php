<?php

namespace App\Services;

use App\Models\JadwalProyek;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class JadwalProyekService
{
    /**
     * Get all schedules
     *
     * @return Collection
     */
    public function getAll(): Collection
    {
        return JadwalProyek::all();
    }

    /**
     * Get paginated schedules
     *
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getPaginated(int $perPage = 10): LengthAwarePaginator
    {
        return JadwalProyek::paginate($perPage);
    }

    /**
     * Find schedule by ID
     *
     * @param int $id
     * @return JadwalProyek|null
     */
    public function findById(int $id): ?JadwalProyek
    {
        return JadwalProyek::find($id);
    }

    /**
     * Create a new schedule
     *
     * @param array $data
     * @return JadwalProyek
     */
    public function create(array $data): JadwalProyek
    {
        return JadwalProyek::create($data);
    }

    /**
     * Update schedule
     *
     * @param int $id
     * @param array $data
     * @return JadwalProyek|null
     */
    public function update(int $id, array $data): ?JadwalProyek
    {
        $jadwal = $this->findById($id);

        if (!$jadwal) {
            return null;
        }

        $jadwal->update($data);
        return $jadwal;
    }

    /**
     * Delete schedule
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool
    {
        $jadwal = $this->findById($id);

        if (!$jadwal) {
            return false;
        }

        return $jadwal->delete();
    }

    /**
     * Get schedules by project ID
     *
     * @param int $proyekId
     * @return Collection
     */
    public function getByProyek(int $proyekId): Collection
    {
        return JadwalProyek::where('proyek_id', $proyekId)->get();
    }

    /**
     * Get schedules by project ID with pagination
     *
     * @param int $proyekId
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getByProyekPaginated(int $proyekId, int $perPage = 10): LengthAwarePaginator
    {
        return JadwalProyek::where('proyek_id', $proyekId)->paginate($perPage);
    }

    /**
     * Get schedule with its project
     *
     * @param int $id
     * @return JadwalProyek|null
     */
    public function getWithProyek(int $id): ?JadwalProyek
    {
        return JadwalProyek::with('proyek')->find($id);
    }

    /**
     * Get upcoming schedules
     *
     * @param int $limit
     * @return Collection
     */
    public function getUpcoming(int $limit = 5): Collection
    {
        return JadwalProyek::where('start_time', '>=', now())
            ->orderBy('start_time')
            ->limit($limit)
            ->get();
    }

    /**
     * Get schedules for a specific date range
     *
     * @param string $startDate
     * @param string $endDate
     * @return Collection
     */
    public function getByDateRange(string $startDate, string $endDate): Collection
    {
        return JadwalProyek::whereBetween('start_time', [$startDate, $endDate])
            ->orWhereBetween('end_time', [$startDate, $endDate])
            ->get();
    }
}
