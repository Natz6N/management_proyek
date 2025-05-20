import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        nama: '',
        deskripsi: '',
        slug: '',
    });

    // Auto-generate slug from name
    useEffect(() => {
        if (data.nama && !data.slug) {
            const slug = data.nama
                .toLowerCase()
                .replace(/[^\w\s-]/g, '') // Remove special characters
                .replace(/\s+/g, '-') // Replace spaces with hyphens
                .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
                .trim();

            setData('slug', slug);
        }
    }, [data.nama]);

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
            title: 'Create',
            href: '/dashboard/categories/create',
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Make sure we have required fields
        if (!data.nama) {
            alert('Category name is required');
            return;
        }

        // Log what we're submitting for debugging
        console.log('Submitting category data:', data);
        console.log('Submitting to route: /dashboard/categories');

        post('/dashboard/categories', {
            onSuccess: () => {
                console.log('Category created successfully');
                reset('nama', 'deskripsi', 'slug');
                // Optionally redirect or show success message
            },
            onError: (errors) => {
                console.error('Failed to create category:', errors);
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Category" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Create New Category</h1>
                    <Link
                        href="/dashboard/categories"
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                        Back to Categories
                    </Link>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="nama" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="nama"
                                type="text"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                                required
                            />
                            {errors.nama && <div className="text-red-500 text-sm mt-1">{errors.nama}</div>}
                        </div>

                        <div>
                            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Slug
                            </label>
                            <input
                                id="slug"
                                type="text"
                                value={data.slug}
                                onChange={(e) => setData('slug', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                            />
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Automatically generated from name (you can edit manually)</p>
                            {errors.slug && <div className="text-red-500 text-sm mt-1">{errors.slug}</div>}
                        </div>

                        <div>
                            <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Description
                            </label>
                            <textarea
                                id="deskripsi"
                                value={data.deskripsi}
                                onChange={(e) => setData('deskripsi', e.target.value)}
                                rows={4}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                            />
                            {errors.deskripsi && <div className="text-red-500 text-sm mt-1">{errors.deskripsi}</div>}
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {processing ? 'Creating...' : 'Create Category'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
