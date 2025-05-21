import WebLayouts from '@/layouts/web-layout';
import { KategoriProyek, Proyek } from '@/types';
import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Package2 } from 'lucide-react';

interface BrowseProps {
    title?: string;
    proyeks: Proyek[] | {
        data: Proyek[];
        links: {
            first: string;
            last: string;
            prev: string | null;
            next: string | null;
        };
        meta: {
            current_page: number;
            from: number;
            last_page: number;
            links: Array<{
                url: string | null;
                label: string;
                active: boolean;
            }>;
            path: string;
            per_page: number;
            to: number;
            total: number;
        };
    };
    categories: KategoriProyek[];
    filters: {
        category: string | null;
        search: string | null;
    };
}

export default function Browse({ title = 'Browse Projects', proyeks, categories, filters }: BrowseProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');

    // Helper to determine if proyeks is a paginated response or an array
    const isPaginated = (obj: unknown): obj is {
        data: Proyek[];
        meta: {
            total: number;
            last_page: number;
            links: Array<{
                url: string | null;
                label: string;
                active: boolean;
            }>
        };
        links: {
            prev: string | null;
            next: string | null
        }
    } => {
        return obj !== null && typeof obj === 'object' && 'data' in obj && 'meta' in obj;
    };

    // Get the actual projects array, whether paginated or not
    const projectsList = isPaginated(proyeks) ? proyeks.data : proyeks;

    // Get the total count safely
    const totalProjects = isPaginated(proyeks) ? proyeks.meta.total : projectsList.length;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        router.get(route('browse'), {
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

        router.get(route('browse'), {
            search: searchTerm,
            category: categoryId === '' ? null : categoryId,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handlePaginationClick = (url: string) => {
        if (url) {
            const urlObj = new URL(url);
            const page = urlObj.searchParams.get('page');

            router.get(route('browse'), {
                search: searchTerm,
                category: selectedCategory,
                page: page,
            }, {
                preserveState: true,
            });
        }
    };

    return (
        <WebLayouts title={title}>
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">Browse Projects</h1>

                {/* Search and Filter */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
                            <input
                                type="text"
                                id="search"
                                placeholder="Search projects..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="md:w-1/3">
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                            <select
                                id="category"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                                className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                            >
                                Search
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                        {totalProjects} {totalProjects === 1 ? 'Project' : 'Projects'} Found
                    </h2>

                    {projectsList.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projectsList.map((proyek) => (
                                    <div key={proyek.id} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        {proyek.image ? (
                                            <div className="h-48 bg-gray-200 dark:bg-gray-600 overflow-hidden">
                                                <img
                                                    src={proyek.image}
                                                    alt={proyek.judul}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = "https://via.placeholder.com/400x300?text=No+Image";
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-48 bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                                <Package2 size={48} className="text-gray-400 dark:text-gray-500" />
                                            </div>
                                        )}
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">{proyek.judul}</h3>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{proyek.deskripsi}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                    {categories.find(c => c.id === proyek.kategori_proyek_id)?.nama || 'Uncategorized'}
                                                </span>
                                                <a
                                                    href={route('showProyek', proyek.slug)}
                                                    className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                                                >
                                                    View Details →
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination - Only show if we have paginated data */}
                            {isPaginated(proyeks) && proyeks.meta.last_page > 1 && (
                                <div className="flex justify-center mt-8">
                                    <nav className="flex items-center space-x-1">
                                        {proyeks.links.prev && (
                                            <button
                                                onClick={() => handlePaginationClick(proyeks.links.prev as string)}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                                            >
                                                Previous
                                            </button>
                                        )}

                                        {proyeks.meta.links.filter(link => !['&laquo; Previous', 'Next &raquo;'].includes(link.label)).map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() => link.url && handlePaginationClick(link.url)}
                                                className={`px-4 py-2 text-sm font-medium border rounded-md ${
                                                    link.active
                                                        ? 'bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500'
                                                        : 'text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                                                } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                                disabled={!link.url}
                                            >
                                                {link.label}
                                            </button>
                                        ))}

                                        {proyeks.links.next && (
                                            <button
                                                onClick={() => handlePaginationClick(proyeks.links.next as string)}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                                            >
                                                Next
                                            </button>
                                        )}
                                    </nav>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400">No projects found matching your criteria.</p>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('');
                                    router.get(route('browse'));
                                }}
                                className="mt-4 px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
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
