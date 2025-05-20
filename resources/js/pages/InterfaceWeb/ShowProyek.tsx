import WebLayouts from '@/layouts/web-layout';
import { KategoriProyek, Proyek } from '@/types';
import React from 'react';
import { Head } from '@inertiajs/inertia-react';

interface ShowProyekProps {
    title?: string;
    proyek: Proyek & { kategori?: KategoriProyek };
    relatedProyeks: Proyek[];
}

export default function ShowProyek({ title = 'Project Details', proyek, relatedProyeks }: ShowProyekProps) {
    return (
        <WebLayouts title={title}>
            <Head title={`${proyek.judul} | Project`} />

            <div className="container mx-auto px-4 py-12">
                <div className="mb-8">
                    <a href={route('browse')} className="text-red-600 hover:text-red-800">
                        &larr; Back to Projects
                    </a>
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="md:flex">
                        <div className="md:w-1/2 h-64 md:h-auto bg-gray-200">
                            {/* Project image would go here */}
                        </div>

                        <div className="p-6 md:p-8 md:w-1/2">
                            <div className="mb-4">
                                <span className="bg-red-100 text-red-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                    {proyek.kategori?.nama || 'Uncategorized'}
                                </span>
                            </div>

                            <h1 className="text-3xl font-bold text-gray-800 mb-4">{proyek.judul}</h1>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-700 mb-3">Description</h3>
                                <p className="text-gray-600">{proyek.deskripsi}</p>
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-semibold text-gray-700 mb-3">Project Details</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Project ID</h4>
                                        <p className="text-gray-800">#{proyek.id}</p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Category</h4>
                                        <p className="text-gray-800">{proyek.kategori?.nama || 'Uncategorized'}</p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Created</h4>
                                        <p className="text-gray-800">{new Date(proyek.created_at).toLocaleDateString()}</p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
                                        <p className="text-gray-800">{new Date(proyek.updated_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Additional project info could go here */}
                        </div>
                    </div>
                </div>

                {/* Project Content Section */}
                <div className="mt-12">
                    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Project Content</h2>

                        <div className="prose max-w-none">
                            {/* This would be the main content of the project */}
                            <p>
                                This is the main content of the project. It could include a detailed description,
                                process details, challenges faced, solutions implemented, technologies used,
                                outcomes achieved, and other relevant information.
                            </p>

                            <h3>Technologies Used</h3>
                            <ul>
                                <li>Technology 1</li>
                                <li>Technology 2</li>
                                <li>Technology 3</li>
                            </ul>

                            <h3>Challenge & Solution</h3>
                            <p>
                                Description of challenges faced during the project and how they were solved.
                            </p>

                            <h3>Results</h3>
                            <p>
                                What was achieved by the end of the project.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Related Projects Section */}
                {relatedProyeks.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Projects</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedProyeks.map((relatedProyek) => (
                                <div key={relatedProyek.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <div className="h-40 bg-gray-200">
                                        {/* Project image would go here */}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{relatedProyek.judul}</h3>
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{relatedProyek.deskripsi}</p>
                                        <a
                                            href={route('showProyek', relatedProyek.slug)}
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
