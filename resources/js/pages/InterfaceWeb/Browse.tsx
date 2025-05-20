import WebLayouts from '@/layouts/web-layout';
import { KategoriProyek, Proyek } from '@/types';
import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';

interface BrowseProps {
    title?: string;
    proyeks: Proyek[];
    categories: KategoriProyek[];
    filters: {
        category: string | null;
        search: string | null;
    };
}

export default function Browse({ title = 'Browse Projects', proyeks, categories, filters }: BrowseProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        Inertia.get(route('browse'), {
            search: searchTerm,
            category: selectedCategory,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const categoryId = e.target.value;
        setSelectedCategory(categoryId);

        Inertia.get(route('browse'), {
            search: searchTerm,
            category: categoryId === '' ? null : categoryId,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <WebLayouts title={title}>
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Browse Projects</h1>

                {/* Search and Filter */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <input
                                type="text"
                                id="search"
                                placeholder="Search projects..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="md:w-1/3">
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                id="category"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                            >
                                <option value="">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id.toString()}>
                                        {category.nama}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:self-end">
                            <button
                                type="submit"
                                className="w-full md:w-auto px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                Search
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        {proyeks.length} {proyeks.length === 1 ? 'Project' : 'Projects'} Found
                    </h2>

                    {proyeks.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {proyeks.map((proyek) => (
                                <div key={proyek.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <div className="h-48 bg-gray-200">
                                        {/* Project image would go here */}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{proyek.judul}</h3>
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{proyek.deskripsi}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="bg-red-100 text-red-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                {categories.find(c => c.id === proyek.kategori_proyek_id)?.nama || 'Uncategorized'}
                                            </span>
                                            <a
                                                href={route('showProyek', proyek.slug)}
                                                className="text-sm font-medium text-red-600 hover:text-red-800"
                                            >
                                                View Details →
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No projects found matching your criteria.</p>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('');
                                    Inertia.get(route('browse'));
                                }}
                                className="mt-4 px-4 py-2 text-sm text-red-600 hover:text-red-800"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </WebLayouts>
    );
}
