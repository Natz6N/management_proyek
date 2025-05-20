import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface Proyek {
    id: number;
    judul: string;
    deskripsi?: string;
    image?: string;
    slug: string;
    kategori_proyek_id: number;
    start_date?: string;
    end_date?: string;
    created_at?: string;
    updated_at?: string;
    kategori?: {
        id: number;
        name: string;
    };
}

interface IndexProps {
    proyeks: Proyek[];
}

export default function Index({ proyeks }: IndexProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Projects',
            href: '/dashboard/projects',
        },
    ];

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Projects" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Projects</h1>
                    <Link
                        href="/dashboard/projects/create"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Add New Project
                    </Link>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-neutral-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Start Date</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">End Date</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-neutral-800 dark:divide-gray-700">
                                {proyeks.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            No projects found. Create your first project!
                                        </td>
                                    </tr>
                                ) : (
                                    proyeks.map((proyek) => (
                                        <tr key={proyek.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {proyek.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                {proyek.judul}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {proyek.kategori?.name || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {formatDate(proyek.start_date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {formatDate(proyek.end_date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 space-x-2">
                                                <Link
                                                    href={`/dashboard/projects/${proyek.id}`}
                                                    className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={`/dashboard/projects/${proyek.id}/edit`}
                                                    className="text-yellow-600 hover:text-yellow-900 dark:hover:text-yellow-400"
                                                >
                                                    Edit
                                                </Link>
                                                <Link
                                                    href={`/dashboard/projects/${proyek.id}`}
                                                    method="delete"
                                                    as="button"
                                                    type="button"
                                                    className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                                                    onSuccess={() => {
                                                        alert('Project deleted successfully!');
                                                    }}
                                                    onClick={(e) => {
                                                        if (!confirm('Are you sure you want to delete this project?')) {
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
