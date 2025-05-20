<?php

namespace App\Services;

use App\Models\JadwalProyek;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class JadwalProyekService extends BaseService
{
    /**
     * Create a new service instance.
     */
    public function __construct()
    {
        $this->model = new JadwalProyek();
    }

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
     * @return Model|null
     */
    public function findById(int $id): ?Model
    {
        return JadwalProyek::find($id);
    }

    /**
     * Create a new schedule
     *
     * @param array $data
     * @return Model
     */
    public function create(array $data): Model
    {
        return JadwalProyek::create($data);
    }

    /**
     * Update schedule
     *
     * @param int $id
     * @param array $data
     * @return Model
     */
    public function update(int $id, array $data): Model
    {
        $jadwal = $this->findById($id);

        if (!$jadwal) {
            throw new \Illuminate\Database\Eloquent\ModelNotFoundException("Schedule with ID {$id} not found");
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
            throw new \Illuminate\Database\Eloquent\ModelNotFoundException("Schedule with ID {$id} not found");
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
     * @return Model|null
     */
    public function getWithProyek(int $id): ?Model
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

    /**
     * Get upcoming events with project information
     *
     * @param int $limit
     * @return Collection
     */
    public function getUpcomingEvents(int $limit = 5): Collection
    {
        return JadwalProyek::with('proyek')
            ->where('start_time', '>=', now())
            ->orderBy('start_time')
            ->limit($limit)
            ->get();
    }

    /**
     * Find schedule by ID with project relation
     *
     * @param int $id
     * @return Model|null
     */
    public function findWithProyek(int $id): ?Model
    {
        return JadwalProyek::with('proyek')->find($id);
    }
}
