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
     * Display a listing of the resource.
     */
    public function index()
    {
        $proyeks = Proyek::all();
        return Inertia::render('Dashboard/Index', [
            'proyeks' => $proyeks
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = KategoriProyek::all();
        return Inertia::render('Dashboard/Create', [
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Use StoreproyekRequest if validation rules are filled
        // $validated = $request->validated();
        $data = $request->only([
            'judul', 'image', 'slug', 'link', 'deskripsi', 'kategori_proyek_id', 'start_date', 'end_date'
        ]);
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image');
        }
        $proyek = Proyek::create($data);

        return redirect()->route('dashboard.index')->with('success', 'Proyek berhasil dibuat');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $proyek = Proyek::findWithAllRelations($id);
        if (!$proyek) {
            return redirect()->route('dashboard.index')->with('error', 'Proyek tidak ditemukan');
        }

        return Inertia::render('Dashboard/Show', [
            'proyek' => $proyek
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $proyek = Proyek::findWithKategori($id);
        if (!$proyek) {
            return redirect()->route('dashboard.index')->with('error', 'Proyek tidak ditemukan');
        }

        $categories = KategoriProyek::all();

        return Inertia::render('Dashboard/Edit', [
            'proyek' => $proyek,
            'categories' => $categories
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Use UpdateproyekRequest if validation rules are filled
        // $validated = $request->validated();
        $data = $request->only([
            'judul', 'image', 'slug', 'link', 'deskripsi', 'kategori_proyek_id', 'start_date', 'end_date'
        ]);
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image');
        }
        $proyek = Proyek::update($id, $data);

        return redirect()->route('dashboard.show', $id)->with('success', 'Proyek berhasil diupdate');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $deleted = Proyek::delete($id);

        return redirect()->route('dashboard.index')->with('success', 'Proyek berhasil dihapus');
    }
}
