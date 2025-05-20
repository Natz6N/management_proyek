import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';

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
}

interface EditProps {
    schedule: Jadwal;
    projects: Proyek[];
}

export default function Edit({ schedule, projects }: EditProps) {
    const { data, setData, post, processing, errors } = useForm({
        judul: schedule.judul || '',
        deskripsi: schedule.deskripsi || '',
        tanggal: schedule.tanggal || '',
        status: schedule.status || 'pending',
        proyek_id: schedule.proyek_id?.toString() || '',
        _method: 'PUT'
    });

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
        {
            title: 'Edit',
            href: `/dashboard/schedules/${schedule.id}/edit`,
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/dashboard/schedules/${schedule.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Schedule: ${schedule.judul}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Edit Schedule: {schedule.judul}</h1>
                    <div className="space-x-3">
                        <Link
                            href={`/dashboard/schedules/${schedule.id}`}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </Link>
                    </div>
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
                            <label htmlFor="proyek_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Project <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="proyek_id"
                                value={data.proyek_id}
                                onChange={(e) => setData('proyek_id', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                                required
                            >
                                <option value="">Select Project</option>
                                {projects.map((project) => (
                                    <option key={project.id} value={project.id.toString()}>
                                        {project.judul}
                                    </option>
                                ))}
                            </select>
                            {errors.proyek_id && <div className="text-red-500 text-sm mt-1">{errors.proyek_id}</div>}
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
                            <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="tanggal"
                                type="date"
                                value={data.tanggal}
                                onChange={(e) => setData('tanggal', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                                required
                            />
                            {errors.tanggal && <div className="text-red-500 text-sm mt-1">{errors.tanggal}</div>}
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="status"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                                required
                            >
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                            {errors.status && <div className="text-red-500 text-sm mt-1">{errors.status}</div>}
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Update Schedule'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
