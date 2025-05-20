import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface Proyek {
    id: number;
    judul: string;
    slug: string;
}

interface Jadwal {
    id: number;
    judul: string;
    deskripsi?: string;
    proyek_id: number;
    tanggal: string;
    status: string;
    created_at?: string;
    updated_at?: string;
    proyek?: Proyek;
}

interface ShowProps {
    schedule: Jadwal;
}

export default function Show({ schedule }: ShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Schedules',
            href: '/dashboard/schedules',
        },
        {
            title: schedule.judul,
            href: `/dashboard/schedules/${schedule.id}`,
        },
    ];

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString();
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            default:
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Schedule: ${schedule.judul}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">{schedule.judul}</h1>
                    <div className="space-x-3">
                        <Link
                            href="/dashboard/schedules"
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                        >
                            Back to Schedules
                        </Link>
                        <Link
                            href={`/dashboard/schedules/${schedule.id}/edit`}
                            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                        >
                            Edit
                        </Link>
                        <Link
                            href={`/dashboard/schedules/${schedule.id}`}
                            method="delete"
                            as="button"
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Main schedule info */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">Schedule Details</h2>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
                                    <p className="mt-1 text-gray-900 dark:text-white whitespace-pre-line">
                                        {schedule.deskripsi || 'No description provided.'}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                                    <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(schedule.status)}`}>
                                        {schedule.status.replace('_', ' ')}
                                    </span>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</h3>
                                    <p className="mt-1 text-gray-900 dark:text-white">
                                        {formatDate(schedule.tanggal)}
                                    </p>
                                </div>

                                {schedule.proyek && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Project</h3>
                                        <Link
                                            href={`/dashboard/projects/${schedule.proyek_id}`}
                                            className="mt-1 text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                            {schedule.proyek.judul}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">Schedule Info</h2>
                            <div className="space-y-3">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">ID</h3>
                                    <p className="mt-1 text-gray-900 dark:text-white">{schedule.id}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</h3>
                                    <p className="mt-1 text-gray-900 dark:text-white">
                                        {schedule.created_at && formatDate(schedule.created_at)}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</h3>
                                    <p className="mt-1 text-gray-900 dark:text-white">
                                        {schedule.updated_at && formatDate(schedule.updated_at)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                            <div className="space-y-3">
                                <Link
                                    href={`/dashboard/schedules/${schedule.id}/edit`}
                                    className="block w-full py-2 px-4 bg-yellow-600 text-white text-center rounded hover:bg-yellow-700 transition-colors"
                                >
                                    Edit Schedule
                                </Link>

                                <Link
                                    href={`/dashboard/projects/${schedule.proyek_id}`}
                                    className="block w-full py-2 px-4 bg-blue-600 text-white text-center rounded hover:bg-blue-700 transition-colors"
                                >
                                    View Related Project
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
