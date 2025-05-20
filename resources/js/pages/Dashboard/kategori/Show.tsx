import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface Proyek {
    id: number;
    judul: string;
    slug: string;
    created_at?: string;
}

interface Category {
    id: number;
    nama: string;
    deskripsi?: string;
    slug?: string;
    created_at?: string;
    updated_at?: string;
    projects?: Proyek[];
    project_count?: number;
}

interface ShowProps {
    category: Category;
}

export default function Show({ category }: ShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Categories',
            href: '/dashboard/categories',
        },
        {
            title: category.nama,
            href: `/dashboard/categories/${category.id}`,
        },
    ];

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Category: ${category.nama}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">{category.nama}</h1>
                    <div className="space-x-3">
                        <Link
                            href="/dashboard/categories"
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                        >
                            Back to Categories
                        </Link>
                        <Link
                            href={`/dashboard/categories/${category.id}/edit`}
                            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                        >
                            Edit
                        </Link>
                        <Link
                            href={`/dashboard/categories/${category.id}`}
                            method="delete"
                            as="button"
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            onClick={(e) => {
                                if (!confirm('Are you sure you want to delete this category? This will remove the category from all associated projects.')) {
                                    e.preventDefault();
                                }
                            }}
                        >
                            Delete
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Main category info */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">Category Details</h2>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
                                    <p className="mt-1 text-gray-900 dark:text-white whitespace-pre-line">
                                        {category.deskripsi || 'No description provided.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Projects section */}
                        {category.projects && category.projects.length > 0 && (
                            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Projects in this Category</h2>
                                    <Link
                                        href={`/dashboard/projects/create?kategori_proyek_id=${category.id}`}
                                        className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                                    >
                                        Add Project
                                    </Link>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-neutral-700">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created At</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-neutral-800 dark:divide-gray-700">
                                            {category.projects.map((project) => (
                                                <tr key={project.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {project.id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                        {project.judul}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {formatDate(project.created_at)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 space-x-2">
                                                        <Link
                                                            href={`/dashboard/projects/${project.id}`}
                                                            className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                                                        >
                                                            View
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">Category Info</h2>
                            <div className="space-y-3">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">ID</h3>
                                    <p className="mt-1 text-gray-900 dark:text-white">{category.id}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Project Count</h3>
                                    <p className="mt-1 text-gray-900 dark:text-white">{category.project_count || 0}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</h3>
                                    <p className="mt-1 text-gray-900 dark:text-white">
                                        {category.created_at && formatDate(category.created_at)}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</h3>
                                    <p className="mt-1 text-gray-900 dark:text-white">
                                        {category.updated_at && formatDate(category.updated_at)}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Slug</h3>
                                    <p className="mt-1 text-gray-900 dark:text-white">{category.slug || '-'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                            <div className="space-y-3">
                                <Link
                                    href={`/dashboard/projects/create?kategori_proyek_id=${category.id}`}
                                    className="block w-full py-2 px-4 bg-green-600 text-white text-center rounded hover:bg-green-700 transition-colors"
                                >
                                    Add Project to this Category
                                </Link>

                                <Link
                                    href={`/dashboard/categories/${category.id}/edit`}
                                    className="block w-full py-2 px-4 bg-yellow-600 text-white text-center rounded hover:bg-yellow-700 transition-colors"
                                >
                                    Edit Category
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
