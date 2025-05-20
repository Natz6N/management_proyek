<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Facades\JadwalFacade as Jadwal;
use App\Facades\ProyekFacade as Proyek;
use App\Http\Requests\StoreproyekRequest;
use App\Http\Requests\UpdateproyekRequest;
use App\Facades\VisitorLogsFacade as VisitorLog;
use App\Facades\KategoriProyekFacade as KategoriProyek;
use App\Facades\KomentarProyekFacade as KomentarProyek;

class DashboardController extends Controller
{
    /**
     * Display dashboard overview.
     */
    public function index()
    {
        $proyeks = Proyek::all();
        $categories = KategoriProyek::all();
        $schedules = Jadwal::getUpcomingEvents();
        $visitorStats = VisitorLog::getStatistics();

        return Inertia::render('Dashboard/Index', [
            'proyeks' => $proyeks,
            'categories' => $categories,
            'schedules' => $schedules,
            'visitorStats' => $visitorStats
        ]);
    }

    /**
     * PROJECT MANAGEMENT
     */

    /**
     * Display a listing of projects.
     */
    public function projectIndex()
    {
        $proyeks = Proyek::all();
        return Inertia::render('Dashboard/Proyek/index', [
            'proyeks' => $proyeks
        ]);
    }

    /**
     * Show the form for creating a new project.
     */
    public function projectCreate()
    {
        $categories = KategoriProyek::all();
        return Inertia::render('Dashboard/Proyek/Create', [
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created project in storage.
     */
    public function projectStore(Request $request)
    {
        $data = $request->only([
            'judul', 'image', 'slug', 'link', 'deskripsi', 'kategori_proyek_id', 'start_date', 'end_date'
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image');
        }

        $proyek = Proyek::create($data);

        return redirect()->route('dashboard.projects.index')->with('success', 'Proyek berhasil dibuat');
    }

    /**
     * Display the specified project.
     */
    public function projectShow($id)
    {
        $proyek = Proyek::findWithAllRelations($id);

        if (!$proyek) {
            return redirect()->route('dashboard.projects.index')->with('error', 'Proyek tidak ditemukan');
        }

        return Inertia::render('Dashboard/Proyek/show', [
            'proyek' => $proyek
        ]);
    }

    /**
     * Show the form for editing the specified project.
     */
    public function projectEdit($id)
    {
        $proyek = Proyek::findWithKategori($id);

        if (!$proyek) {
            return redirect()->route('dashboard.projects.index')->with('error', 'Proyek tidak ditemukan');
        }

        $categories = KategoriProyek::all();

        return Inertia::render('Dashboard/Proyek/Edit', [
            'proyek' => $proyek,
            'categories' => $categories
        ]);
    }

    /**
     * Update the specified project in storage.
     */
    public function projectUpdate(Request $request, $id)
    {
        $data = $request->only([
            'judul', 'image', 'slug', 'link', 'deskripsi', 'kategori_proyek_id', 'start_date', 'end_date'
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image');
        }

        $proyek = Proyek::update($id, $data);

        return redirect()->route('dashboard.projects.show', $id)->with('success', 'Proyek berhasil diupdate');
    }

    /**
     * Remove the specified project from storage.
     */
    public function projectDestroy($id)
    {
        $deleted = Proyek::delete($id);

        return redirect()->route('dashboard.projects.index')->with('success', 'Proyek berhasil dihapus');
    }

    /**
     * CATEGORY MANAGEMENT
     */

    /**
     * Display a listing of categories.
     */
    public function categoryIndex()
    {
        $categories = KategoriProyek::all();
        return Inertia::render('Dashboard/kategori/Index', [
            'categories' => $categories
        ]);
    }

    /**
     * Show the form for creating a new category.
     */
    public function categoryCreate()
    {
        return Inertia::render('Dashboard/kategori/Create');
    }

    /**
     * Store a newly created category in storage.
     */
    public function categoryStore(Request $request)
    {
        $data = $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'slug' => 'nullable|string|max:255',
        ]);

        $category = KategoriProyek::create($data);

        return redirect()->route('dashboard.categories.index')->with('success', 'Kategori berhasil dibuat');
    }

    /**
     * Display the specified category.
     */
    public function categoryShow($id)
    {
        $category = KategoriProyek::find($id);

        if (!$category) {
            return redirect()->route('dashboard.categories.index')->with('error', 'Kategori tidak ditemukan');
        }

        $proyeks = Proyek::getByKategori($id);

        return Inertia::render('Dashboard/kategori/Show', [
            'category' => $category,
            'proyeks' => $proyeks
        ]);
    }

    /**
     * Show the form for editing the specified category.
     */
    public function categoryEdit($id)
    {
        $category = KategoriProyek::find($id);

        if (!$category) {
            return redirect()->route('dashboard.categories.index')->with('error', 'Kategori tidak ditemukan');
        }

        return Inertia::render('Dashboard/kategori/Edit', [
            'category' => $category
        ]);
    }

    /**
     * Update the specified category in storage.
     */
    public function categoryUpdate(Request $request, $id)
    {
        $data = $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'slug' => 'nullable|string|max:255',
        ]);

        $category = KategoriProyek::update($id, $data);

        return redirect()->route('dashboard.categories.index')->with('success', 'Kategori berhasil diupdate');
    }

    /**
     * Remove the specified category from storage.
     */
    public function categoryDestroy($id)
    {
        // Check if there are any projects using this category
        $proyeks = Proyek::getByKategori($id);

        if (count($proyeks) > 0) {
            return redirect()->route('dashboard.categories.index')->with('error', 'Kategori tidak dapat dihapus karena masih digunakan oleh proyek');
        }

        $deleted = KategoriProyek::delete($id);

        return redirect()->route('dashboard.categories.index')->with('success', 'Kategori berhasil dihapus');
    }

    /**
     * SCHEDULE MANAGEMENT
     */

    /**
     * Display a listing of schedules.
     */
    public function scheduleIndex()
    {
        $schedules = Jadwal::all();
        return Inertia::render('Dashboard/jadwal/Index', [
            'schedules' => $schedules
        ]);
    }

    /**
     * Show the form for creating a new schedule.
     */
    public function scheduleCreate()
    {
        $proyeks = Proyek::all();
        return Inertia::render('Dashboard/jadwal/Create', [
            'proyeks' => $proyeks
        ]);
    }

    /**
     * Store a newly created schedule in storage.
     */
    public function scheduleStore(Request $request)
    {
        $data = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'proyek_id' => 'required|integer|exists:proyeks,id',
            'tanggal' => 'required|date',
            'status' => 'required|string|in:pending,in_progress,completed'
        ]);

        $schedule = Jadwal::create($data);

        return redirect()->route('dashboard.schedules.index')->with('success', 'Jadwal berhasil dibuat');
    }

    /**
     * Display the specified schedule.
     */
    public function scheduleShow($id)
    {
        $schedule = Jadwal::findWithProyek($id);

        if (!$schedule) {
            return redirect()->route('dashboard.schedules.index')->with('error', 'Jadwal tidak ditemukan');
        }

        return Inertia::render('Dashboard/jadwal/Show', [
            'schedule' => $schedule
        ]);
    }

    /**
     * Show the form for editing the specified schedule.
     */
    public function scheduleEdit($id)
    {
        $schedule = Jadwal::findWithProyek($id);

        if (!$schedule) {
            return redirect()->route('dashboard.schedules.index')->with('error', 'Jadwal tidak ditemukan');
        }

        $proyeks = Proyek::all();

        return Inertia::render('Dashboard/jadwal/Edit', [
            'schedule' => $schedule,
            'proyeks' => $proyeks
        ]);
    }

    /**
     * Update the specified schedule in storage.
     */
    public function scheduleUpdate(Request $request, $id)
    {
        $data = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'proyek_id' => 'required|integer|exists:proyeks,id',
            'tanggal' => 'required|date',
            'status' => 'required|string|in:pending,in_progress,completed'
        ]);

        $schedule = Jadwal::update($id, $data);

        return redirect()->route('dashboard.schedules.index')->with('success', 'Jadwal berhasil diupdate');
    }

    /**
     * Remove the specified schedule from storage.
     */
    public function scheduleDestroy($id)
    {
        $deleted = Jadwal::delete($id);

        return redirect()->route('dashboard.schedules.index')->with('success', 'Jadwal berhasil dihapus');
    }
}
