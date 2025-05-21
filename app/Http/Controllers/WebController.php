<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Facades\JadwalFacade as Jadwal;
use App\Facades\ProyekFacade as Proyek;
use App\Facades\VisitorLogsFacade as VisitorLog;
use App\Facades\KategoriProyekFacade as KategoriProyek;

class WebController extends Controller
{
    /**
     * Display the home page
     */
    public function index()
    {
        // Get featured projects
        $featuredProyeks = Proyek::getFeatured();

        // Get all categories
        $categories = KategoriProyek::all();

        // Get upcoming schedules/events
        $upcomingEvents = Jadwal::getUpcomingEvents();

        // Log visitor
        VisitorLog::recordVisit('home');

        return Inertia::render('InterfaceWeb/Home', [
            'featuredProyeks' => $featuredProyeks,
            'categories' => $categories,
            'upcomingEvents' => $upcomingEvents
        ]);
    }

    /**
     * Browse all projects
     */
    public function browse(Request $request)
    {
        // Get filter parameters
        $kategoriId = $request->input('category');
        $search = $request->input('search');

        // Get all projects with optional filtering
        $proyeks = Proyek::getAllWithFilter($kategoriId, $search);

        // Get all categories for filter options
        $categories = KategoriProyek::all();

        // Log visitor
        VisitorLog::recordVisit('browse', ['category' => $kategoriId, 'search' => $search]);

        return Inertia::render('InterfaceWeb/Browse', [
            'proyeks' => $proyeks,
            'categories' => $categories,
            'filters' => [
                'category' => $kategoriId,
                'search' => $search
            ]
        ]);
    }

    /**
     * Show project details
     */
    public function showProyek($slug)
    {
        // Get project by slug
        $proyek = Proyek::getBySlug($slug);

        if (!$proyek) {
            return redirect()->route('home')->with('error', 'Project not found');
        }

        // Get related projects
        $relatedProyeks = Proyek::getRelated($proyek->id, $proyek->kategori_proyek_id);

        // Get popular categories
        $popularCategories = KategoriProyek::getPopular(6);

        // Log visitor
        VisitorLog::recordVisit('project', ['project_id' => $proyek->id]);

        return Inertia::render('InterfaceWeb/ShowProyek', [
            'proyek' => $proyek,
            'relatedProyeks' => $relatedProyeks,
            'popularCategories' => $popularCategories,
            'title' => $proyek->judul,
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    /**
     * Show schedule/event details
     */
    public function showJadwal($id)
    {
        // Get schedule by ID
        $jadwal = Jadwal::findWithProyek($id);

        if (!$jadwal) {
            return redirect()->route('home')->with('error', 'Schedule not found');
        }

        // Get upcoming events
        $upcomingEvents = Jadwal::getUpcomingEvents(5);

        // Log visitor
        VisitorLog::recordVisit('schedule', ['schedule_id' => $jadwal->id]);

        return Inertia::render('InterfaceWeb/showjadwal', [
            'jadwal' => $jadwal,
            'upcomingEvents' => $upcomingEvents
        ]);
    }

    /**
     * Contact form submission
     */
    public function contact(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string',
            'subject' => 'nullable|string|max:255',
        ]);

        // Here you would typically send an email or save to database

        return redirect()->back()->with('success', 'Your message has been sent successfully!');
    }

    /**
     * API Search functionality
     * Searches across projects, categories, and schedules
     */
    public function search(Request $request)
    {
        // Get the search query
        $query = $request->input('query');
        $limit = $request->input('limit', 6);

        if (!$query || strlen($query) < 2) {
            return response()->json([
                'categories' => [],
                'projects' => [],
                'schedules' => []
            ]);
        }

        // Search for categories
        $categories = KategoriProyek::search($query, $limit);

        // Search for projects
        $projects = Proyek::search($query, $limit);

        // Search for schedules
        $schedules = Jadwal::search($query, $limit);

        // Format the results for the frontend
        $formattedResults = [
            'categories' => $categories->map(function($category) {
                return [
                    'id' => $category->id,
                    'title' => $category->nama,
                    'type' => 'category',
                    'slug' => $category->slug ?? null,
                ];
            }),

            'projects' => $projects->map(function($project) {
                return [
                    'id' => $project->id,
                    'title' => $project->judul,
                    'type' => 'product',
                    'slug' => $project->slug,
                    'image' => $project->image,
                ];
            }),

            'schedules' => $schedules->map(function($schedule) {
                return [
                    'id' => $schedule->id,
                    'title' => $schedule->nama,
                    'type' => 'schedule',
                    'date' => $schedule->start_time,
                ];
            }),
        ];

        return response()->json($formattedResults);
    }
}
