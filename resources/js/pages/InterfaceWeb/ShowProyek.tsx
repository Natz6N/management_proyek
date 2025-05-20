import WebLayouts from '@/layouts/web-layout';
import { KategoriProyek, Proyek } from '@/types';
import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

interface ShowProyekProps {
    title?: string;
    proyek: Proyek & { 
        kategori?: KategoriProyek;
        harga?: number;
        diskon?: number;
        stok?: number;
        spesifikasi?: {
            [key: string]: string;
        };
        galeriImages?: string[];
        fitur?: string[];
    };
    relatedProyeks: Proyek[];
    popularCategories: KategoriProyek[];
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
}

export default function ShowProyek({ title = 'Product Details', proyek, relatedProyeks, popularCategories, auth }: ShowProyekProps) {
    const [activeImage, setActiveImage] = useState(proyek.image || '');
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    
    // Format currency to IDR
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };
    
    // Format date to locale format
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    
    // Calculate discount price if available
    const discountedPrice = proyek.diskon && proyek.harga
        ? proyek.harga - (proyek.harga * (proyek.diskon / 100))
        : null;
    
    // Truncate description for preview
    const truncateDescription = (text: string, maxLength: number = 300) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    };
    
    // Handle download request
    const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!auth.user) {
            e.preventDefault();
            setShowLoginModal(true);
        }
    };

    return (
        <WebLayouts title={title}>
            <Head title={`${proyek.judul} | Project`} />

            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="flex mb-6" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        <li className="inline-flex items-center">
                            <a href={route('home')} className="text-gray-700 hover:text-red-600">
                                Home
                            </a>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                                </svg>
                                <a href={route('browse')} className="text-gray-700 hover:text-red-600">
                                    Projects
                                </a>
                            </div>
                        </li>
                        <li aria-current="page">
                            <div className="flex items-center">
                                <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                                </svg>
                                <span className="text-gray-500">{proyek.judul}</span>
                            </div>
                        </li>
                    </ol>
                </nav>

                {/* Project Detail */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="md:flex">
                        {/* Project Image */}
                        <div className="md:w-2/5">
                            <div className="h-80 md:h-96 bg-gray-100 flex items-center justify-center overflow-hidden">
                                {proyek.image ? (
                                    <img 
                                        src={activeImage} 
                                        alt={proyek.judul} 
                                        className="w-full h-full object-contain p-4"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full w-full bg-gray-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            
                            {/* Gallery Images - if applicable */}
                            {proyek.galeriImages && proyek.galeriImages.length > 0 && (
                                <div className="flex overflow-x-auto p-2 space-x-2 bg-gray-50">
                                    {proyek.image && (
                                        <div 
                                            className={`w-20 h-20 shrink-0 cursor-pointer border-2 ${activeImage === proyek.image ? 'border-red-500' : 'border-transparent'}`}
                                            onClick={() => setActiveImage(proyek.image || '')}
                                        >
                                            <img 
                                                src={proyek.image} 
                                                alt={`${proyek.judul} thumbnail`} 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    
                                    {proyek.galeriImages.map((img, index) => (
                                        <div 
                                            key={index}
                                            className={`w-20 h-20 shrink-0 cursor-pointer border-2 ${activeImage === img ? 'border-red-500' : 'border-transparent'}`}
                                            onClick={() => setActiveImage(img)}
                                        >
                                            <img 
                                                src={img} 
                                                alt={`${proyek.judul} gallery ${index + 1}`} 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Project Details */}
                        <div className="p-6 md:p-8 md:w-3/5">
                            {/* Category Badge */}
                            {proyek.kategori && (
                                <div className="mb-3">
                                    <span className="bg-red-100 text-red-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                        {proyek.kategori.nama || 'Uncategorized'}
                                    </span>
                                </div>
                            )}

                            {/* Project Title */}
                            <h1 className="text-3xl font-bold text-gray-800 mb-4">{proyek.judul}</h1>
                            
                            {/* Project Duration */}
                            <div className="mb-4 flex items-center text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{formatDate(proyek.start_date)} {proyek.end_date ? `- ${formatDate(proyek.end_date)}` : ''}</span>
                            </div>

                            {/* Project Description - Truncated */}
                            <div className="mb-6">
                                <div className="text-gray-700 leading-relaxed">
                                    {showFullDescription ? (
                                        proyek.deskripsi
                                    ) : (
                                        proyek.deskripsi && proyek.deskripsi.length > 300 ? (
                                            <>
                                                {truncateDescription(proyek.deskripsi)}
                                                <button 
                                                    className="ml-1 text-red-600 hover:text-red-800 font-medium"
                                                    onClick={() => setShowFullDescription(true)}
                                                >
                                                    Read More
                                                </button>
                                            </>
                                        ) : (
                                            proyek.deskripsi
                                        )
                                    )}
                                </div>
                            </div>
                            
                            {/* Download Link - Protected */}
                            {proyek.link && (
                                <div className="mt-8">
                                    {auth.user ? (
                                        <a 
                                            href={proyek.link} 
                                            className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            Download Project
                                        </a>
                                    ) : (
                                        <div>
                                            <button 
                                                onClick={() => setShowLoginModal(true)} 
                                                className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                                Download Project
                                            </button>
                                            <p className="text-sm text-gray-500 mt-2">Login required to download this project</p>
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {/* Project Details */}
                            <div className="border-t border-gray-200 pt-4 mt-6">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-500">Category:</span>
                                        <span className="ml-2 text-gray-700">{proyek.kategori?.nama || 'Uncategorized'}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-500">Project Date:</span>
                                        <span className="ml-2 text-gray-700">{formatDate(proyek.start_date)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Project Content Section */}
                <div className="mt-12">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="border-b border-gray-200">
                            <nav className="flex -mb-px">
                                <a href="#description" className="border-b-2 border-red-600 py-4 px-6 text-red-600 font-medium">
                                    Details
                                </a>
                                <a href="#reviews" className="border-b-2 border-transparent py-4 px-6 text-gray-500 hover:text-gray-700 font-medium">
                                    Comments
                                </a>
                            </nav>
                        </div>

                        {/* Description Tab Content */}
                        <div id="description" className="p-6 md:p-8">
                            <div className="prose max-w-none">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Project Details</h2>
                                
                                <div className="space-y-4">
                                    {proyek.deskripsi ? (
                                        <div className="text-gray-700 leading-relaxed">
                                            {proyek.deskripsi.split('\n').map((paragraph, index) => (
                                                <p key={index} className="mb-4">{paragraph}</p>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-700 leading-relaxed">
                                            No detailed description available for this project.
                                        </p>
                                    )}
                                </div>

                                {/* Project Features - if applicable */}
                                {proyek.fitur && proyek.fitur.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Features</h3>
                                        <ul className="list-disc pl-6 space-y-2">
                                            {proyek.fitur.map((feature, index) => (
                                                <li key={index} className="text-gray-700">{feature}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="mt-8">
                    <div id="reviews" className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Comments</h2>
                            {auth.user ? (
                                <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                                    Write a Comment
                                </button>
                            ) : (
                                <button 
                                    onClick={() => setShowLoginModal(true)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                    Login to Comment
                                </button>
                            )}
                        </div>
                        
                        {/* Sample Comments - Would be replaced with actual comments from database */}
                        <div className="space-y-6">
                            <div className="border-b border-gray-200 pb-6">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mr-3">
                                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold">
                                            JD
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center mb-1">
                                            <h4 className="font-medium text-gray-800 mr-2">John Doe</h4>
                                            <span className="text-sm text-gray-500">3 days ago</span>
                                        </div>
                                        <p className="text-gray-600">
                                            This is a great project. Very well documented and easy to understand.
                                            I'm looking forward to more projects like this.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="border-b border-gray-200 pb-6">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mr-3">
                                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold">
                                            SM
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center mb-1">
                                            <h4 className="font-medium text-gray-800 mr-2">Sarah Miller</h4>
                                            <span className="text-sm text-gray-500">1 week ago</span>
                                        </div>
                                        <p className="text-gray-600">
                                            Thank you for sharing this project. It helped me understand the concept better.
                                            The documentation is clear and comprehensive.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-6 text-center">
                            <button className="text-red-600 font-medium hover:text-red-800">
                                Load More Comments
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Projects Section */}
                {relatedProyeks && relatedProyeks.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Projects</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {relatedProyeks.map((relatedProyek) => (
                                <div key={relatedProyek.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                                        {relatedProyek.image ? (
                                            <img 
                                                src={relatedProyek.image} 
                                                alt={relatedProyek.judul} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full w-full bg-gray-200">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        {relatedProyek.kategori && (
                                            <span className="text-xs text-gray-500">{relatedProyek.kategori.nama}</span>
                                        )}
                                        <h3 className="text-lg font-medium text-gray-800 mb-1 hover:text-red-600">
                                            <a href={route('showProyek', relatedProyek.slug)}>
                                                {relatedProyek.judul}
                                            </a>
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{relatedProyek.deskripsi}</p>
                                        
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="text-sm text-gray-600">
                                                {formatDate(relatedProyek.start_date)}
                                            </div>
                                            <a
                                                href={route('showProyek', relatedProyek.slug)}
                                                className="text-sm font-medium text-red-600 hover:text-red-800"
                                            >
                                                View Details
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Popular Categories Section */}
                <div className="mt-12 mb-16">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Popular Categories</h2>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                        {popularCategories && popularCategories.length > 0 ? (
                            popularCategories.map((category) => {
                                // Generate a consistent color based on category id
                                const colors = [
                                    "bg-blue-100", "bg-pink-100", "bg-green-100", 
                                    "bg-purple-100", "bg-yellow-100", "bg-red-100"
                                ];
                                const colorIndex = category.id % colors.length;
                                const color = colors[colorIndex];
                                
                                // Get first letter of category name for icon fallback
                                const firstLetter = category.nama.charAt(0).toUpperCase();
                                
                                return (
                                    <a 
                                        key={category.id} 
                                        href={route('browse', { category: category.id })}
                                        className={`${color} rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow`}
                                    >
                                        <div className="p-4 text-center">
                                            <div className="text-3xl mb-2 font-bold">{firstLetter}</div>
                                            <h3 className="text-sm font-medium text-gray-800">{category.nama}</h3>
                                            {category.proyek_count !== undefined && (
                                                <div className="mt-1 text-xs text-gray-600">
                                                    {category.proyek_count} Projects
                                                </div>
                                            )}
                                        </div>
                                    </a>
                                );
                            })
                        ) : (
                            // Fallback if no categories are available
                            [
                                { id: 1, name: "Electronics", icon: "💻", color: "bg-blue-100" },
                                { id: 2, name: "Fashion", icon: "👔", color: "bg-pink-100" },
                                { id: 3, name: "Home & Kitchen", icon: "🏠", color: "bg-green-100" },
                                { id: 4, name: "Health & Beauty", icon: "💄", color: "bg-purple-100" },
                                { id: 5, name: "Sports", icon: "⚽", color: "bg-yellow-100" },
                                { id: 6, name: "Books", icon: "📚", color: "bg-red-100" }
                            ].map((category) => (
                                <a 
                                    key={category.id} 
                                    href={route('browse', { category: category.id })}
                                    className={`${category.color} rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow`}
                                >
                                    <div className="p-4 text-center">
                                        <div className="text-3xl mb-2">{category.icon}</div>
                                        <h3 className="text-sm font-medium text-gray-800">{category.name}</h3>
                                        <div className="mt-1 text-xs text-gray-600">
                                            Explore
                                        </div>
                                    </div>
                                </a>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Login Modal */}
            {showLoginModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Login Required</h3>
                        <p className="text-gray-600 mb-6">
                            Please login or create an account to access this content.
                        </p>
                        <div className="flex flex-col space-y-3">
                            <Link 
                                href={route('login')} 
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md text-center"
                            >
                                Login
                            </Link>
                            <Link 
                                href={route('register')} 
                                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md text-center"
                            >
                                Register
                            </Link>
                            <button 
                                onClick={() => setShowLoginModal(false)}
                                className="w-full text-gray-600 hover:text-gray-800 font-medium py-2"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </WebLayouts>
    );
}