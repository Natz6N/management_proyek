<?php

namespace App\Services;

use App\Models\VisitorLogs;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class VisitorLogsService
{
    /**
     * Get all visitor logs
     *
     * @return Collection
     */
    public function getAll(): Collection
    {
        return VisitorLogs::all();
    }

    /**
     * Get paginated visitor logs
     *
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getPaginated(int $perPage = 20): LengthAwarePaginator
    {
        return VisitorLogs::orderBy('visited_at', 'desc')->paginate($perPage);
    }

    /**
     * Find visitor log by ID
     *
     * @param int $id
     * @return VisitorLogs|null
     */
    public function findById(int $id): ?VisitorLogs
    {
        return VisitorLogs::find($id);
    }

    /**
     * Create a new visitor log
     *
     * @param array $data
     * @return VisitorLogs
     */
    public function create(array $data): VisitorLogs
    {
        return VisitorLogs::create($data);
    }

    /**
     * Update visitor log
     *
     * @param int $id
     * @param array $data
     * @return VisitorLogs|null
     */
    public function update(int $id, array $data): ?VisitorLogs
    {
        $log = $this->findById($id);

        if (!$log) {
            return null;
        }

        $log->update($data);
        return $log;
    }

    /**
     * Delete visitor log
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool
    {
        $log = $this->findById($id);

        if (!$log) {
            return false;
        }

        return $log->delete();
    }

    /**
     * Log a visit
     *
     * @param string $path
     * @param int|null $userId
     * @return VisitorLogs
     */
    public function logVisit(string $path, ?int $userId = null): VisitorLogs
    {
        return $this->create([
            'path' => $path,
            'user_id' => $userId,
            'visited_at' => now(),
        ]);
    }

    /**
     * Get logs by user ID
     *
     * @param int $userId
     * @return Collection
     */
    public function getByUser(int $userId): Collection
    {
        return VisitorLogs::where('user_id', $userId)
            ->orderBy('visited_at', 'desc')
            ->get();
    }

    /**
     * Get logs by user ID with pagination
     *
     * @param int $userId
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getByUserPaginated(int $userId, int $perPage = 10): LengthAwarePaginator
    {
        return VisitorLogs::where('user_id', $userId)
            ->orderBy('visited_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get logs by path
     *
     * @param string $path
     * @return Collection
     */
    public function getByPath(string $path): Collection
    {
        return VisitorLogs::where('path', $path)
            ->orderBy('visited_at', 'desc')
            ->get();
    }

    /**
     * Get log with its user
     *
     * @param int $id
     * @return VisitorLogs|null
     */
    public function getWithUser(int $id): ?VisitorLogs
    {
        return VisitorLogs::with('user')->find($id);
    }

    /**
     * Get recent logs
     *
     * @param int $limit
     * @return Collection
     */
    public function getRecent(int $limit = 20): Collection
    {
        return VisitorLogs::with('user')
            ->orderBy('visited_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get logs for a date range
     *
     * @param string $startDate
     * @param string $endDate
     * @return Collection
     */
    public function getByDateRange(string $startDate, string $endDate): Collection
    {
        return VisitorLogs::whereBetween('visited_at', [$startDate, $endDate])
            ->orderBy('visited_at', 'desc')
            ->get();
    }

    /**
     * Get visitor count by path
     *
     * @return array
     */
    public function getVisitorCountByPath(): array
    {
        return VisitorLogs::selectRaw('path, COUNT(*) as total')
            ->groupBy('path')
            ->orderByRaw('COUNT(*) desc')
            ->get()
            ->toArray();
    }

    /**
     * Get visitor count by date
     *
     * @param int $days Number of previous days to include
     * @return array
     */
    public function getVisitorCountByDate(int $days = 7): array
    {
        $startDate = now()->subDays($days)->startOfDay();

        return VisitorLogs::selectRaw('DATE(visited_at) as date, COUNT(*) as total')
            ->where('visited_at', '>=', $startDate)
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->toArray();
    }
}
