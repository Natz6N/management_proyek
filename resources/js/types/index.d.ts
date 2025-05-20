import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

// Sesuai tabel 'proyek'
export interface Proyek {
    id: number;
    judul: string;
    image?: string;
    slug: string;
    link?: string;
    deskripsi?: string | null;
    kategori_proyek_id: number;
    start_date: string; // date (YYYY-MM-DD)
    end_date?: string | null; // date (YYYY-MM-DD) nullable
    created_at: string;
    updated_at: string;
}

// Sesuai tabel 'kategori__proyeks'
export interface KategoriProyek {
    id: number;
    nama: string;
    deskripsi: string;
}

// Sesuai tabel 'jadwal'
export interface Jadwal {
    id: number;
    nama: string;
    deskripsi?: string | null;
    start_time: string; // dateTime (YYYY-MM-DD HH:mm:ss)
    end_time?: string | null; // dateTime nullable
    proyek_id: number;
    created_at: string;
    updated_at: string;
}

