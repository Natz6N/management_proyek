import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface Kategori {
    id: number;
    nama: string;
}

interface Jadwal {
    id: number;
    judul: string;
    deskripsi?: string;
    tanggal: string;
    status: string;
    proyek_id: number;
}

interface Komentar {
    id: number;
    isi: string;
    created_at: string;
    user: {
        id: number;
        name: string;
    };
}

interface Proyek {
    id: number;
    judul: string;
    deskripsi?: string;
    image?: string;
    slug: string;
    link?: string;
    kategori_proyek_id: number;
    start_date?: string;
    end_date?: string;
    created_at?: string;
    updated_at?: string;
    kategori?: Kategori;
    jadwal?: Jadwal[];
    komentar?: Komentar[];
}

interface ShowProps {
    proyek: Proyek;
}

export default function Show({ proyek }: ShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Projects',
            href: '/dashboard/projects',
        },
        {
            title: proyek.judul,
            href: `/dashboard/projects/${proyek.id}`,
        },
    ];

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Project: ${proyek.judul}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">{proyek.judul}</h1>
                    <div className="space-x-3">
                        <Link
                            href="/dashboard/projects"
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                        >
                            Back to Projects
                        </Link>
                        <Link
                            href={`/dashboard/projects/${proyek.id}/edit`}
                            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                        >
                            Edit
                        </Link>
                        <Link
                            href={`/dashboard/projects/${proyek.id}`}
                            method="delete"
                            as="button"
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            onSuccess={() => {
                                // Handle success
                            }}
                            onClick={(e) => {
                                if (!confirm('Are you sure you want to delete this project?')) {
                                    e.preventDefault();
                                }
                            }}
                        >
                            Delete
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Main project info */}
                    <div className="lg:col-span-2 space-y-4">
                        {proyek.image && (
                            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
                                <img
                                    src={proyek.image}
                                    alt={proyek.judul}
                                    className="w-full h-auto max-h-96 object-contain"
                                />
                            </div>
                        )}

                        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">Project Details</h2>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
                                    <p className="mt-1 text-gray-900 dark:text-white whitespace-pre-line">
                                        {proyek.deskripsi || 'No description provided.'}
                                    </p>
                                </div>

                                {proyek.link && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">External Link</h3>
                                        <a
                                            href={proyek.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-1 text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                            {proyek.link}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Schedule section */}
                        {proyek.jadwal && proyek.jadwal.length > 0 && (
                            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Project Schedule</h2>
                                    <Link
                                        href={`/dashboard/schedules/create?proyek_id=${proyek.id}`}
                                        className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                                    >
                                        Add Schedule
                                    </Link>
                                </div>

                                <div className="space-y-4">
                                    {proyek.jadwal.map((jadwal) => (
                                        <div key={jadwal.id} className="border dark:border-neutral-700 rounded-lg p-4">
                                            <div className="flex justify-between mb-2">
                                                <h3 className="font-medium text-gray-900 dark:text-white">{jadwal.judul}</h3>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    ${jadwal.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                                    jadwal.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                                                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`
                                                }>
                                                    {jadwal.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{jadwal.deskripsi}</p>
                                            <div className="mt-2 flex justify-between items-center">
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formatDate(jadwal.tanggal)}
                                                </span>
                                                <div className="space-x-2">
                                                    <Link
                                                        href={`/dashboard/schedules/${jadwal.id}/edit`}
                                                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <Link
                                                        href={`/dashboard/schedules/${jadwal.id}`}
                                                        method="delete"
                                                        as="button"
                                                        className="text-xs text-red-600 dark:text-red-400 hover:underline"
                                                        onClick={(e) => {
                                                            if (!confirm('Are you sure you want to delete this schedule?')) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                    >
                                                        Delete
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Comments section */}
                        {proyek.komentar && proyek.komentar.length > 0 && (
                            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
                                <h2 className="text-xl font-semibold mb-4">Comments</h2>
                                <div className="space-y-4">
                                    {proyek.komentar.map((komentar) => (
                                        <div key={komentar.id} className="border dark:border-neutral-700 rounded-lg p-4">
                                            <div className="flex justify-between mb-2">
                                                <h3 className="font-medium text-gray-900 dark:text-white">{komentar.user.name}</h3>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(komentar.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-400">{komentar.isi}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">Project Info</h2>
                            <div className="space-y-3">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">ID</h3>
                                    <p className="mt-1 text-gray-900 dark:text-white">{proyek.id}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</h3>
                                    <Link
                                        href={`/dashboard/categories/${proyek.kategori_proyek_id}`}
                                        className="mt-1 text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        {proyek.kategori?.nama || 'Uncategorized'}
                                    </Link>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Date Range</h3>
                                    <p className="mt-1 text-gray-900 dark:text-white">
                                        {proyek.start_date ? (
                                            <>
                                                {formatDate(proyek.start_date)}
                                                {proyek.end_date && ` - ${formatDate(proyek.end_date)}`}
                                            </>
                                        ) : (
                                            'Not specified'
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</h3>
                                    <p className="mt-1 text-gray-900 dark:text-white">
                                        {proyek.created_at && formatDate(proyek.created_at)}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</h3>
                                    <p className="mt-1 text-gray-900 dark:text-white">
                                        {proyek.updated_at && formatDate(proyek.updated_at)}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Slug</h3>
                                    <p className="mt-1 text-gray-900 dark:text-white">{proyek.slug}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                            <div className="space-y-3">
                                <Link
                                    href={`/dashboard/schedules/create?proyek_id=${proyek.id}`}
                                    className="block w-full py-2 px-4 bg-green-600 text-white text-center rounded hover:bg-green-700 transition-colors"
                                >
                                    Add Schedule
                                </Link>

                                <Link
                                    href={`/dashboard/projects/${proyek.id}/edit`}
                                    className="block w-full py-2 px-4 bg-yellow-600 text-white text-center rounded hover:bg-yellow-700 transition-colors"
                                >
                                    Edit Project
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
