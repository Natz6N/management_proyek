import Natz from '@/components/ui/natzLogo';
import { Head } from '@inertiajs/react';
import { Search } from 'lucide-react';
import React, { KeyboardEvent, MouseEvent, useEffect, useState } from 'react';

interface WebPropsLayout {
    children: React.ReactNode;
    title?: string;
    onSearch?: (query: string) => void;
}

type Theme = 'dark' | 'light';
export default function WebLayouts({ children, title, onSearch }: WebPropsLayout) {
    const [searchValue, setSearchValue] = useState<string>('');
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [theme, setTheme] = useState<Theme>('light');

    // Handle theme toggle
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setTheme('theme', newTheme);
    };

    // Load theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    // Update document class for theme
    useEffect(() => {
        document.documentElement.className = theme;
    }, [theme]);

    const handleSearchSubmit = (e: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLInputElement>): void => {
        e.preventDefault();
        // Handle search logic here
        console.log('Searching for:', searchValue);

        if (onSearch) {
            onSearch(searchValue);
        }
    };

    return (
        <>
            <Head title={title} />
            <nav className="flex flex-wrap items-center justify-between bg-white px-6 py-3 shadow-md">
                {/* Theme Toggle Button */}

                <div className="z-20 flex items-center">
                    {/* Logo */}
                    <Natz />
                </div>
                {/* Hamburger menu for mobile */}
                <button
                    className="z-20 flex items-center rounded border border-gray-400 px-3 py-2 text-gray-700 md:hidden"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle Menu"
                >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                {/* Search bar for desktop */}
                <div className="mx-4 hidden w-full max-w-md flex-1 md:block">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Cari..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:border-transparent focus:ring-2 focus:ring-red-500 focus:outline-none"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearchSubmit(e);
                                }
                            }}
                        />
                        <button
                            onClick={handleSearchSubmit}
                            className="absolute top-1/2 right-2 -translate-y-1/2 transform text-gray-500 hover:text-red-600"
                        >
                            <Search size={20} />
                        </button>
                    </div>
                </div>
                {/* Desktop menu */}
                <ul className="z-20 hidden items-center space-x-6 font-medium text-gray-700 md:flex">
                    <li>
                        <a href="#" className="transition-colors hover:text-red-600">
                            Home
                        </a>
                    </li>
                    <li>
                        <a href="#" className="transition-colors hover:text-red-600">
                            About
                        </a>
                    </li>
                    <li>
                        <a href="#" className="transition-colors hover:text-red-600">
                            Services
                        </a>
                    </li>
                    <li>
                        <a href="#" className="transition-colors hover:text-red-600">
                            Contact
                        </a>
                    </li>
                </ul>
                {/* Mobile menu overlay */}
                {menuOpen && <div className="bg-opacity-40 fixed inset-0 z-10 bg-black md:hidden" onClick={() => setMenuOpen(false)}></div>}
                {/* Mobile menu */}
                <div
                    className={`fixed top-0 right-0 z-30 h-full w-64 transform bg-white shadow-lg ${menuOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col transition-transform duration-300 md:hidden`}
                >
                    <button className="m-4 self-end" onClick={() => setMenuOpen(false)} aria-label="Close Menu">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12M6 18L18 6" />
                        </svg>
                    </button>
                    {/* Search bar for mobile */}
                    <div className="mb-4 px-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Cari..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:border-transparent focus:ring-2 focus:ring-red-500 focus:outline-none"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearchSubmit(e);
                                    }
                                }}
                            />
                            <button
                                onClick={handleSearchSubmit}
                                className="absolute top-1/2 right-2 -translate-y-1/2 transform text-gray-500 hover:text-red-600"
                            >
                                <Search size={20} />
                            </button>
                        </div>
                    </div>
                    <ul className="flex flex-col space-y-4 px-6 font-medium text-gray-700">
                        <li>
                            <a href="#" className="transition-colors hover:text-red-600" onClick={() => setMenuOpen(false)}>
                                Home
                            </a>
                        </li>
                        <li>
                            <a href="#" className="transition-colors hover:text-red-600" onClick={() => setMenuOpen(false)}>
                                About
                            </a>
                        </li>
                        <li>
                            <a href="#" className="transition-colors hover:text-red-600" onClick={() => setMenuOpen(false)}>
                                Services
                            </a>
                        </li>
                        <li>
                            <a href="#" className="transition-colors hover:text-red-600" onClick={() => setMenuOpen(false)}>
                                Contact
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
            {children}
            <footer className="mt-10 w-full bg-gray-100 py-6 text-center shadow-inner">
                <div className="container mx-auto flex flex-col items-center justify-between px-4 md:flex-row">
                    <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} MyWebsite. All rights reserved.</p>
                    <div className="mt-2 flex space-x-4 md:mt-0">
                        <a href="#" className="text-gray-500 transition-colors hover:text-red-600">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-gray-500 transition-colors hover:text-red-600">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </footer>
            <div className="fixed bottom-4 right-4 z-50">
                <button
                    onClick={toggleTheme}
                    className="rounded-full bg-gray-200 p-2 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    aria-label="Toggle theme"
                >
                    {theme === 'light' ? (
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                        </svg>
                    ) : (
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                        </svg>
                    )}
                </button>
            </div>
        </>
    );
}
