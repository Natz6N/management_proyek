import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';
import { useEffect } from 'react';

interface Category {
    id: number;
    name: string;
}

interface CreateProps {
    categories: Category[];
}

export default function Create({ categories }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        judul: '',
        slug: '',
        link: '',
        deskripsi: '',
        kategori_proyek_id: '',
        start_date: '',
        end_date: '',
        image: null as File | null,
    });

    // Auto-generate slug from title
    useEffect(() => {
        if (data.judul && !data.slug) {
            const slug = data.judul
                .toLowerCase()
                .replace(/[^\w\s-]/g, '') // Remove special characters
                .replace(/\s+/g, '-') // Replace spaces with hyphens
                .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
                .trim();

            setData('slug', slug);
        }
    }, [data.judul]);

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
            title: 'Create',
            href: '/dashboard/projects/create',
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/dashboard/projects');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Project" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Create New Project</h1>
                    <Link
                        href="/dashboard/projects"
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                        Back to Projects
                    </Link>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="judul" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="judul"
                                type="text"
                                value={data.judul}
                                onChange={(e) => setData('judul', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                                required
                            />
                            {errors.judul && <div className="text-red-500 text-sm mt-1">{errors.judul}</div>}
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
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Automatically generated from title (you can edit manually)</p>
                            {errors.slug && <div className="text-red-500 text-sm mt-1">{errors.slug}</div>}
                        </div>

                        <div>
                            <label htmlFor="kategori_proyek_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="kategori_proyek_id"
                                value={data.kategori_proyek_id}
                                onChange={(e) => setData('kategori_proyek_id', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {errors.kategori_proyek_id && <div className="text-red-500 text-sm mt-1">{errors.kategori_proyek_id}</div>}
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

                        <div>
                            <label htmlFor="link" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Link
                            </label>
                            <input
                                id="link"
                                type="url"
                                value={data.link}
                                onChange={(e) => setData('link', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                                placeholder="https://example.com"
                            />
                            {errors.link && <div className="text-red-500 text-sm mt-1">{errors.link}</div>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Start Date
                                </label>
                                <input
                                    id="start_date"
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                                />
                                {errors.start_date && <div className="text-red-500 text-sm mt-1">{errors.start_date}</div>}
                            </div>

                            <div>
                                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    End Date
                                </label>
                                <input
                                    id="end_date"
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                                />
                                {errors.end_date && <div className="text-red-500 text-sm mt-1">{errors.end_date}</div>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Project Image
                            </label>
                            <input
                                id="image"
                                type="file"
                                onChange={(e) => setData('image', e.target.files?.[0] || null)}
                                className="mt-1 block w-full dark:text-white"
                                accept="image/*"
                            />
                            {errors.image && <div className="text-red-500 text-sm mt-1">{errors.image}</div>}
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {processing ? 'Creating...' : 'Create Project'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
