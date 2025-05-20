import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface Category {
    id: number;
    nama: string;
    deskripsi?: string;
    slug?: string;
    created_at?: string;
    updated_at?: string;
    project_count?: number;
}

interface IndexProps {
    categories: Category[];
}

export default function Index({ categories }: IndexProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Categories',
            href: '/dashboard/categories',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Categories" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Categories</h1>
                    <Link
                        href="/dashboard/categories/create"
                        className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                    >
                        Add New Category
                    </Link>
                </div>

                <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-neutral-800">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-neutral-700">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                                    >
                                        ID
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                                    >
                                        Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                                    >
                                        Description
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                                    >
                                        Slug
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                                    >
                                        Projects
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                                    >
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-neutral-800">
                                {categories.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            No categories found. Create your first category!
                                        </td>
                                    </tr>
                                ) : (
                                    categories.map((category) => (
                                        <tr key={category.id}>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">{category.id}</td>
                                            <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-white">
                                                {category.nama}
                                            </td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                {category.deskripsi
                                                    ? category.deskripsi.length > 50
                                                        ? `${category.deskripsi.substring(0, 50)}...`
                                                        : category.deskripsi
                                                    : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                {category.slug || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                {category.project_count || 0}
                                            </td>
                                            <td className="space-x-2 px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                <Link
                                                    href={`/dashboard/categories/${category.id}`}
                                                    className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={`/dashboard/categories/${category.id}/edit`}
                                                    className="text-yellow-600 hover:text-yellow-900 dark:hover:text-yellow-400"
                                                >
                                                    Edit
                                                </Link>
                                                <Link
                                                    href={`/dashboard/categories/${category.id}`}
                                                    method="delete"
                                                    as="button"
                                                    type="button"
                                                    className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                                                    onSuccess={() => {
                                                        alert('Category deleted successfully!');
                                                    }}
                                                    onClick={(e) => {
                                                        if (
                                                            !confirm(
                                                                'Are you sure you want to delete this category? This will remove the category from all associated projects.',
                                                            )
                                                        ) {
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
