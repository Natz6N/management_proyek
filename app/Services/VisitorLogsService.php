<?php

namespace App\Services;

use App\Models\VisitorLogs;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class VisitorLogsService extends BaseService
{
    /**
     * Create a new service instance.
     */
    public function __construct()
    {
        $this->model = new VisitorLogs();
    }

    /**
     * Get visitor statistics
     *
     * @return array
     */
    public function getStatistics(): array
    {
        return [
            'total' => VisitorLogs::count(),
            'today' => VisitorLogs::whereDate('visited_at', today())->count(),
            'week' => VisitorLogs::where('visited_at', '>=', now()->subDays(7))->count(),
            'month' => VisitorLogs::where('visited_at', '>=', now()->subDays(30))->count(),
            'by_path' => $this->getVisitorCountByPath(),
            'by_date' => $this->getVisitorCountByDate()
        ];
    }

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
     * @return Model|null
     */
    public function findById(int $id): ?Model
    {
        return VisitorLogs::find($id);
    }

    /**
     * Create a new visitor log
     *
     * @param array $data
     * @return Model
     */
    public function create(array $data): Model
    {
        return VisitorLogs::create($data);
    }

    /**
     * Update visitor log
     *
     * @param int $id
     * @param array $data
     * @return Model
     */
    public function update(int $id, array $data): Model
    {
        $log = $this->findById($id);

        if (!$log) {
            throw new \Illuminate\Database\Eloquent\ModelNotFoundException("Visitor log with ID {$id} not found");
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
            throw new \Illuminate\Database\Eloquent\ModelNotFoundException("Visitor log with ID {$id} not found");
        }

        return $log->delete();
    }

    /**
     * Log a visit
     *
     * @param string $path
     * @param int|null $userId
     * @return Model
     */
    public function logVisit(string $path, ?int $userId = null): Model
    {
        return $this->create([
            'path' => $path,
            'user_id' => $userId,
            'visited_at' => now(),
        ]);
    }

    /**
     * Record a page visit with metadata
     *
     * @param string $page Page identifier
     * @param array $metadata Additional metadata about the visit
     * @return Model
     */
    public function recordVisit(string $page, array $metadata = []): Model
    {
        // Get authenticated user if exists
        $userId = auth()->id();

        // Get IP address and user agent
        $ip = request()->ip();
        $userAgent = request()->userAgent();

        // Create log entry
        return $this->create([
            'path' => $page,
            'user_id' => $userId,
            'ip_address' => $ip,
            'user_agent' => $userAgent,
            'metadata' => json_encode($metadata),
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
     * @return Model|null
     */
    public function getWithUser(int $id): ?Model
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
