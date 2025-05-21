import Natz from '@/components/ui/natzLogo';
import { Head, router } from '@inertiajs/react';
import { Search, Calendar, Package2, FolderTree, Moon, Sun, Menu, X } from 'lucide-react';
import React, { KeyboardEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import axios from 'axios';

interface WebPropsLayout {
    children: React.ReactNode;
    title?: string;
    onSearch?: (query: string) => void;
}

interface SearchResult {
    id: number;
    title: string;
    type: 'category' | 'product' | 'schedule';
    slug?: string;
    image?: string;
    date?: string;
}

interface CategoryResult {
    id: number;
    title: string;
    type: 'category';
    slug: string | null;
}

interface ProjectResult {
    id: number;
    title: string;
    type: 'product';
    slug: string;
    image: string;
}

interface ScheduleResult {
    id: number;
    title: string;
    type: 'schedule';
    date: string;
}

interface SearchApiResponse {
    categories: CategoryResult[];
    projects: ProjectResult[];
    schedules: ScheduleResult[];
}

type Theme = 'dark' | 'light';
export default function WebLayouts({ children, title, onSearch }: WebPropsLayout) {
    const [searchValue, setSearchValue] = useState<string>('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [showResults, setShowResults] = useState<boolean>(false);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [theme, setTheme] = useState<Theme>('light');
    const searchRef = useRef<HTMLDivElement>(null);

    // Handle clicks outside the search component
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside as unknown as EventListener);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside as unknown as EventListener);
        };
    }, [searchRef]);

    // Handle theme toggle
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);

        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    // Load theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        if (savedTheme) {
            setTheme(savedTheme);
            if (savedTheme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // Set dark mode based on system preference if no saved theme
            setTheme('dark');
            document.documentElement.classList.add('dark');
        }
    }, []);

    // Function to fetch search results
    const fetchSearchResults = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);

        try {
            // Call the API endpoint
            const response = await axios.get<SearchApiResponse>('/api/search', {
                params: { query, limit: 6 }
            });

            const data = response.data;

            // Transform API results into the format we need
            const formattedResults: SearchResult[] = [
                // Format category results
                ...data.categories.map((category) => ({
                    id: category.id,
                    title: category.title,
                    type: 'category' as const,
                    slug: category.slug || undefined
                })),

                // Format project results
                ...data.projects.map((project) => ({
                    id: project.id,
                    title: project.title,
                    type: 'product' as const,
                    slug: project.slug,
                    image: project.image
                })),

                // Format schedule results
                ...data.schedules.map((schedule) => ({
                    id: schedule.id,
                    title: schedule.title,
                    type: 'schedule' as const,
                    date: schedule.date
                }))
            ];

            setSearchResults(formattedResults);
            setIsSearching(false);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
            setIsSearching(false);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value;
        setSearchValue(value);

        if (value.length >= 2) {
            fetchSearchResults(value);
            setShowResults(true);
        } else {
            setSearchResults([]);
            setShowResults(false);
        }
    };

    const handleSearchSubmit = (e: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLInputElement>): void => {
        e.preventDefault();

        if (!searchValue.trim()) return;

        // Close search results
        setShowResults(false);

        // Redirect to search results page
        router.visit(route('browse', { search: searchValue }));

        if (onSearch) {
            onSearch(searchValue);
        }
    };

    const handleResultClick = (result: SearchResult): void => {
        setShowResults(false);

        switch (result.type) {
            case 'category':
                router.visit(route('browse', { category: result.id }));
                break;
            case 'product':
                router.visit(route('showProyek', result.slug));
                break;
            case 'schedule':
                router.visit(route('showJadwal', result.id));
                break;
        }
    };

    return (
        <div className="min-h-screen flex flex-col transition-colors duration-200 bg-gray-50 dark:bg-gray-900">
            <Head title={title} />

            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border-b border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center justify-between h-16">
                        {/* Logo and brand */}
                        <div className="flex items-center flex-shrink-0">
                            <a href={route('home')} className="flex items-center space-x-2">
                                <Natz />
                            </a>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex md:items-center md:justify-between md:flex-1 ml-10">
                            {/* Search bar */}
                            <div className="w-full max-w-md relative" ref={searchRef}>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search for projects, categories, schedules..."
                                        value={searchValue}
                                        onChange={handleSearchChange}
                                        className="w-full rounded-md border-gray-300 pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSearchSubmit(e);
                                            }
                                        }}
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search size={16} className="text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <button
                                        onClick={handleSearchSubmit}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                                    >
                                        <span className="text-xs font-medium mr-1 hidden sm:inline">Search</span>
                                    </button>

                                    {/* Search Results Dropdown */}
                                    {showResults && (
                                        <div className="absolute z-50 mt-1 w-full rounded-md bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                            {isSearching ? (
                                                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                                    Searching...
                                                </div>
                                            ) : searchResults.length > 0 ? (
                                                <ul className="max-h-80 overflow-y-auto">
                                                    {searchResults.map((result) => (
                                                        <li key={`${result.type}-${result.id}`} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                                                            <button
                                                                className="flex w-full items-center px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                                onClick={() => handleResultClick(result)}
                                                            >
                                                                <div className="flex-shrink-0 mr-3">
                                                                    {result.type === 'category' && (
                                                                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                                                                            <FolderTree size={16} className="text-blue-600 dark:text-blue-300" />
                                                                        </div>
                                                                    )}
                                                                    {result.type === 'product' && (
                                                                        <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-full">
                                                                            <Package2 size={16} className="text-emerald-600 dark:text-emerald-300" />
                                                                        </div>
                                                                    )}
                                                                    {result.type === 'schedule' && (
                                                                        <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-full">
                                                                            <Calendar size={16} className="text-orange-600 dark:text-orange-300" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium text-gray-900 dark:text-white">{result.title}</div>
                                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                        {result.type === 'category' ? 'Category' :
                                                                         result.type === 'product' ? 'Project' :
                                                                         `Schedule${result.date ? ` - ${new Date(result.date).toLocaleDateString()}` : ''}`}
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : searchValue.length >= 2 ? (
                                                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                                    No results found
                                                </div>
                                            ) : null}

                                            {searchValue.length >= 2 && (
                                                <div className="border-t border-gray-100 dark:border-gray-700 p-2">
                                                    <button
                                                        onClick={handleSearchSubmit as React.MouseEventHandler}
                                                        className="flex w-full items-center justify-center rounded-md bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 text-sm text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                                                    >
                                                        <Search size={16} className="mr-2" />
                                                        Search for "{searchValue}"
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Desktop menu */}
                            <div className="hidden md:block ml-6">
                                <ul className="flex items-center space-x-6 font-medium">
                                    <li>
                                        <a href={route('home')} className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                            Home
                                        </a>
                                    </li>
                                    <li>
                                        <a href={route('browse')} className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                            Projects
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                            Schedule
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                            Contact
                                        </a>
                                    </li>
                                    <li>
                                        <button
                                            onClick={toggleTheme}
                                            className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            aria-label="Toggle theme"
                                        >
                                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex md:hidden items-center space-x-3">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                aria-label="Toggle theme"
                            >
                                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                            </button>
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                aria-label="Toggle Menu"
                            >
                                {menuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Mobile menu */}
            <div className={`
                fixed inset-0 z-40 transition-all duration-300 ease-in-out
                ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
            `}>
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300
                    ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setMenuOpen(false)}
                />

                {/* Menu panel */}
                <div className={`
                    absolute top-0 right-0 w-full max-w-xs h-full bg-white dark:bg-gray-800 shadow-xl
                    transform transition-transform duration-300 ease-in-out
                    ${menuOpen ? 'translate-x-0' : 'translate-x-full'}
                `}>
                    {/* Search bar for mobile */}
                    <div className="px-5 py-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchValue}
                                onChange={handleSearchChange}
                                className="w-full rounded-md border-gray-300 pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearchSubmit(e);
                                        setMenuOpen(false);
                                    }
                                }}
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={16} className="text-gray-400 dark:text-gray-500" />
                            </div>
                            <button
                                onClick={(e) => {
                                    handleSearchSubmit(e);
                                    setMenuOpen(false);
                                }}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                            >
                                <span className="text-xs font-medium">Search</span>
                            </button>
                        </div>
                    </div>

                    {/* Navigation links */}
                    <div className="border-t border-gray-200 dark:border-gray-700">
                        <nav className="px-5 py-6">
                            <ul className="space-y-6">
                                <li>
                                    <a
                                        href={route('home')}
                                        className="flex items-center text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Home
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href={route('browse')}
                                        className="flex items-center text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Projects
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Schedule
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <main className="flex-grow">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="mb-4 md:mb-0">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                &copy; {new Date().getFullYear()} ProyekManagement. All rights reserved.
                            </p>
                        </div>
                        <div className="flex space-x-6">
                            <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                Terms of Service
                            </a>
                            <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                Support
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
