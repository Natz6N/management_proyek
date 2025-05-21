import React, { useState, useEffect } from 'react';
import {
  Search,
  Moon,
  Sun,
  ChevronRight,
  ChevronLeft,
  Filter,
  X,
  Package2,
  Loader2
} from 'lucide-react';
import { KategoriProyek, Proyek } from '@/types';
import axios from 'axios';
import WebLayouts from '@/layouts/web-layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface BrowsePageProps {
  proyeks: Proyek[];
  categories: KategoriProyek[];
  filters?: {
    category: string | null;
    search: string | null;
  };
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

const BrowsePage: React.FC<BrowsePageProps> = ({
  proyeks: initialProyeks = [],
  categories = [],
  filters = { category: null, search: null }
}) => {
  // State management
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>(filters.search || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(filters.category || '');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [proyeks, setProyeks] = useState<Proyek[]>(Array.isArray(initialProyeks) ? initialProyeks : []);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    current_page: 1,
    last_page: Math.ceil(Array.isArray(initialProyeks) ? initialProyeks.length : 0 / 6),
    per_page: 6,
    total: Array.isArray(initialProyeks) ? initialProyeks.length : 0,
  });
  
  // Search debounce
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>(filters.search || '');
  
  const projectsPerPage = 6;

  // Safely check for browser environment before accessing localStorage
  const isBrowser = typeof window !== 'undefined';

  // Set dark mode based on system preference or localStorage
  useEffect(() => {
    if (isBrowser) {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isBrowser]);
  
  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    
    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);
  
  // Fetch projects when filters or pagination change
  useEffect(() => {
    const fetchProyeks = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/projects', {
          params: {
            search: debouncedSearchTerm,
            category: selectedCategory,
            page: currentPage,
            per_page: projectsPerPage
          }
        });
        
        if (response.data) {
          setProyeks(response.data.proyeks);
          setPaginationMeta(response.data.pagination);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProyeks();
  }, [debouncedSearchTerm, selectedCategory, currentPage]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    if (!isBrowser) return;

    setDarkMode(prev => !prev);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  // Handle category selection
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset to page 1 when changing category
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setCurrentPage(1);
  };

  return (
    <WebLayouts title="Browse Projects">
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Main content */}
          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside
              className={`
                w-full md:w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg
                transition-all duration-300 ease-in-out mb-6 md:mb-0 md:mr-6
                ${sidebarOpen ? 'block' : 'hidden md:block'}
                md:sticky md:top-24 md:h-fit
              `}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Filters</h2>
                  <button
                    onClick={toggleSidebar}
                    className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    aria-label="Toggle sidebar"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSearch} className="mb-6">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Search Projects
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                                dark:bg-gray-700 dark:text-white"
                      placeholder="Search by name..."
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={16} className="text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                </form>

                <div className="mb-6">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                            dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">All Categories</option>
                    {Array.isArray(categories) && categories.map((category) => (
                      <option key={category.id} value={category.id.toString()}>
                        {category.nama}
                      </option>
                    ))}
                  </select>
                </div>

                {(searchTerm || selectedCategory) && (
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400
                            border border-indigo-200 dark:border-indigo-800 rounded-md
                            hover:bg-indigo-50 dark:hover:bg-indigo-900/30
                            transition duration-150 ease-in-out"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </aside>

            {/* Main content area */}
            <main className="flex-1">
              {/* Mobile filter toggle & result counts */}
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Browse Projects</h1>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    {paginationMeta.total} Projects Found
                  </span>
                  <button
                    onClick={toggleSidebar}
                    className="md:hidden bg-white dark:bg-gray-800 p-2 rounded-md shadow text-gray-500 dark:text-gray-400"
                  >
                    <Filter size={20} />
                  </button>
                </div>
              </div>

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-center items-center py-12">
                  <Loader2 size={40} className="text-indigo-500 animate-spin" />
                </div>
              )}

              {/* Projects grid */}
              {!isLoading && proyeks.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {proyeks.map((proyek) => (
                      <Card key={proyek.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        {proyek.image ? (
                          <div className="h-48 bg-gray-200 dark:bg-gray-700">
                            <img
                              src={proyek.image}
                              alt={proyek.judul}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "https://via.placeholder.com/400x200?text=Project+Image";
                              }}
                            />
                          </div>
                        ) : (
                          <div className="h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <Package2 size={64} className="text-gray-300 dark:text-gray-600" />
                          </div>
                        )}

                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl truncate">{proyek.judul}</CardTitle>
                            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-indigo-900 dark:text-indigo-300">
                              {Array.isArray(categories) && categories.find(c => c.id === proyek.kategori_proyek_id)?.nama || 'Uncategorized'}
                            </span>
                          </div>
                          <CardDescription>
                            <p className="line-clamp-3">
                              {proyek.deskripsi || 'No description available'}
                            </p>
                          </CardDescription>
                        </CardHeader>

                        <CardFooter className="justify-end">
                          <a
                            href={`/show/${proyek.slug}`}
                            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            View Details
                            <ChevronRight size={16} className="ml-1" />
                          </a>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>

                  {/* Pagination */}
                  {paginationMeta.last_page > 1 && (
                    <div className="mt-8 flex justify-center">
                      <nav className="flex items-center space-x-1">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className={`px-3 py-2 rounded-md flex items-center ${
                            currentPage === 1
                              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <ChevronLeft size={16} />
                          <span className="sr-only md:not-sr-only md:ml-2">Previous</span>
                        </button>

                        <div className="hidden md:flex space-x-1">
                          {Array.from({ length: paginationMeta.last_page }, (_, i) => i + 1).map(number => (
                            <button
                              key={number}
                              onClick={() => setCurrentPage(number)}
                              className={`px-4 py-2 rounded-md ${
                                currentPage === number
                                  ? 'bg-indigo-600 text-white'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                            >
                              {number}
                            </button>
                          ))}
                        </div>

                        <div className="flex md:hidden items-center space-x-1">
                          <span className="text-gray-700 dark:text-gray-300">
                            {currentPage} of {paginationMeta.last_page}
                          </span>
                        </div>

                        <button
                          onClick={() => setCurrentPage(Math.min(paginationMeta.last_page, currentPage + 1))}
                          disabled={currentPage === paginationMeta.last_page}
                          className={`px-3 py-2 rounded-md flex items-center ${
                            currentPage === paginationMeta.last_page
                              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <span className="sr-only md:not-sr-only md:mr-2">Next</span>
                          <ChevronRight size={16} />
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              ) : !isLoading && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Package2 size={64} className="text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No projects found</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    No projects match your current search criteria. Try adjusting your filters or search term.
                  </p>
                  {(searchTerm || selectedCategory) && (
                    <button
                      onClick={clearFilters}
                      className="mt-4 px-4 py-2 text-sm text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </WebLayouts>
  );
};

export default BrowsePage;
