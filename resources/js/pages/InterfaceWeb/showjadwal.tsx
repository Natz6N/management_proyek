import WebLayouts from '@/layouts/web-layout';
import { Jadwal } from '@/types';
import React from 'react';
import { Head } from '@inertiajs/inertia-react';

interface ShowJadwalProps {
    title?: string;
    jadwal: Jadwal & { proyek?: any }; // Including associated project data
    upcomingEvents: Jadwal[];
}

export default function ShowJadwal({ title = 'Schedule Details', jadwal, upcomingEvents }: ShowJadwalProps) {
    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <WebLayouts title={title}>
            <Head title={`${jadwal.nama} | Schedule`} />

            <div className="container mx-auto px-4 py-12">
                <div className="mb-8">
                    <a href={route('home')} className="text-red-600 hover:text-red-800">
                        &larr; Back to Home
                    </a>
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6 md:p-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">{jadwal.nama}</h1>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="md:col-span-3">
                                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Description</h3>
                                    <p className="text-gray-600">
                                        {jadwal.deskripsi || 'No description available.'}
                                    </p>
                                </div>

                                {jadwal.proyek && (
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-700 mb-3">Associated Project</h3>
                                        <div className="flex items-center">
                                            <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4">
                                                {/* Project image would go here */}
                                            </div>
                                            <div>
                                                <h4 className="text-gray-800 font-semibold">{jadwal.proyek.judul}</h4>
                                                <p className="text-gray-600 text-sm">{jadwal.proyek.deskripsi}</p>
                                                <a
                                                    href={route('showProyek', jadwal.proyek.slug)}
                                                    className="text-red-600 text-sm hover:text-red-800 font-medium"
                                                >
                                                    View Project →
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="md:col-span-1">
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Schedule Details</h3>

                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium text-gray-500">Start Time</h4>
                                        <p className="text-gray-800">{formatDate(jadwal.start_time)}</p>
                                    </div>

                                    {jadwal.end_time && (
                                        <div className="mb-4">
                                            <h4 className="text-sm font-medium text-gray-500">End Time</h4>
                                            <p className="text-gray-800">{formatDate(jadwal.end_time)}</p>
                                        </div>
                                    )}

                                    <div className="mt-6">
                                        <div className="flex items-center mb-2">
                                            <div className={`w-3 h-3 rounded-full mr-2 ${
                                                new Date(jadwal.end_time || "") < new Date()
                                                    ? 'bg-gray-400'
                                                    : new Date(jadwal.start_time) > new Date()
                                                        ? 'bg-blue-400'
                                                        : 'bg-green-400'
                                            }`}></div>
                                            <span className="text-sm text-gray-600">
                                                {new Date(jadwal.end_time || "") < new Date()
                                                    ? 'Completed'
                                                    : new Date(jadwal.start_time) > new Date()
                                                        ? 'Upcoming'
                                                        : 'In Progress'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upcoming Events Section */}
                {upcomingEvents.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Events</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {upcomingEvents.map((event) => (
                                <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{event.nama}</h3>
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.deskripsi || 'No description available.'}</p>

                                        <div className="flex items-center text-sm text-gray-500 mb-3">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>{formatDate(event.start_time)}</span>
                                        </div>

                                        <a
                                            href={route('showJadwal', event.id)}
                                            className="text-sm font-medium text-red-600 hover:text-red-800"
                                        >
                                            View Details →
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </WebLayouts>
    );
}
