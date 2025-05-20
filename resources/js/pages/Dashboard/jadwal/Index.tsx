import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface Proyek {
    id: number;
    judul: string;
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

interface IndexProps {
    schedules: Jadwal[];
}

export default function Index({ schedules }: IndexProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Schedules',
            href: '/dashboard/schedules',
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
            <Head title="Manage Schedules" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Schedules</h1>
                    <Link
                        href="/dashboard/schedules/create"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Add New Schedule
                    </Link>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-neutral-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Project</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-neutral-800 dark:divide-gray-700">
                                {schedules.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            No schedules found. Create your first schedule!
                                        </td>
                                    </tr>
                                ) : (
                                    schedules.map((jadwal) => (
                                        <tr key={jadwal.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {jadwal.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                {jadwal.judul}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {jadwal.proyek ? (
                                                    <Link
                                                        href={`/dashboard/projects/${jadwal.proyek_id}`}
                                                        className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                                                    >
                                                        {jadwal.proyek.judul}
                                                    </Link>
                                                ) : (
                                                    <span>Unknown Project</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {formatDate(jadwal.tanggal)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(jadwal.status)}`}>
                                                    {jadwal.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 space-x-2">
                                                <Link
                                                    href={`/dashboard/schedules/${jadwal.id}`}
                                                    className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={`/dashboard/schedules/${jadwal.id}/edit`}
                                                    className="text-yellow-600 hover:text-yellow-900 dark:hover:text-yellow-400"
                                                >
                                                    Edit
                                                </Link>
                                                <Link
                                                    href={`/dashboard/schedules/${jadwal.id}`}
                                                    method="delete"
                                                    as="button"
                                                    type="button"
                                                    className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                                                    onSuccess={() => {
                                                        alert('Schedule deleted successfully!');
                                                    }}
                                                    onClick={(e) => {
                                                        if (!confirm('Are you sure you want to delete this schedule?')) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
