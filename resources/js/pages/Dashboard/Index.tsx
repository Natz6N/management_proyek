import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Chart } from '@/components/ui/chart';

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
}

interface IndexProps {
    proyeks: Proyek[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Index({ proyeks }: IndexProps) {
    // Sample data for charts
    const barData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [
            {
                label: 'Sales',
                data: [120, 190, 300, 500, 200],
                backgroundColor: 'rgba(239, 68, 68, 0.7)',
            },
        ],
    };
    const lineData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [
            {
                label: 'Visitors',
                data: [100, 200, 150, 300, 250],
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                fill: true,
            },
        ],
    };
    const pieData = {
        labels: ['Product A', 'Product B', 'Product C'],
        datasets: [
            {
                label: 'Revenue',
                data: [300, 50, 100],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(251, 191, 36, 0.7)',
                    'rgba(239, 68, 68, 0.7)',
                ],
            },
        ],
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border bg-white dark:bg-neutral-900 flex items-center justify-center">
                        <Chart type="bar" data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border bg-white dark:bg-neutral-900 flex items-center justify-center">
                        <Chart type="line" data={lineData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border bg-white dark:bg-neutral-900 flex items-center justify-center">
                        <Chart type="pie" data={pieData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
                    </div>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="grid grid-cols-2 gap-4 p-4">
                        <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                        <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                    </div>
                </div>
                {proyeks && proyeks.length > 0 && (
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-4">
                        <h2 className="text-xl font-semibold mb-3">Daftar Proyek</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {proyeks.map((proyek) => (
                                <div key={proyek.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-lg border p-4">
                                    <h3 className="font-medium">{proyek.judul}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {proyek.deskripsi?.substring(0, 100)}...
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
