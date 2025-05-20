import WebLayouts from '@/layouts/web-layout';
import { Jadwal, KategoriProyek, Proyek } from '@/types';
import React, { useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// Import required modules
import { Pagination, Autoplay } from 'swiper/modules';

interface HomeProps {
    title?: string;
    featuredProyeks: Proyek[];
    categories: KategoriProyek[];
    upcomingEvents: Jadwal[];
}

export default function Home({ title = 'Home', featuredProyeks, categories, upcomingEvents }: HomeProps) {
    const [activeTab, setActiveTab] = useState('all');

    // Testimonial data
    const testimonials = [
        {
            id: 1,
            name: 'Ahmad Rahman',
            role: 'Business Owner',
            image: '/api/placeholder/60/60',
            content: 'Kerja sama dengan Natz sangat memuaskan. Proyek selesai tepat waktu dan hasilnya luar biasa!',
            rating: 5
        },
        {
            id: 2,
            name: 'Linda Susanti',
            role: 'Marketing Manager',
            image: '/api/placeholder/60/60',
            content: 'Saya sangat puas dengan website yang dibuat. Responsif dan sesuai dengan kebutuhan bisnis kami.',
            rating: 5
        },
        {
            id: 3,
            name: 'Budi Santoso',
            role: 'Startup Founder',
            image: '/api/placeholder/60/60',
            content: 'Natz memahami kebutuhan kami dengan baik dan memberikan solusi yang tepat untuk aplikasi kami.',
            rating: 4
        },
    ];

    // Filter projects by category if needed
    const filteredProjects = activeTab === 'all'
        ? featuredProyeks
        : featuredProyeks.filter(project => project.kategori_proyek_id.toString() === activeTab);

    return (
        <WebLayouts title={title}>
            <div className="flex w-full flex-col">

                {/* Hero Section */}
                <section className="flex w-full items-center justify-center bg-gray-100 py-20">
                    <div className="container mx-auto px-6 text-center">
                        <div className="mx-auto max-w-3xl">
                            <h1 className="mb-6 text-4xl leading-tight font-bold text-gray-800 md:text-5xl">
                                HELLO EVERYONE, I'M <span className="text-red-600">Natz</span>, A Junior Developer
                            </h1>
                            <p className="mb-8 text-lg text-gray-600">
                                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempore adipisci totam nulla accusamus nemo autem saepe,
                                sint maiores modi molestiae beatae fuga nisi quas magni iure voluptates, perspiciatis id vel!
                            </p>
                            <div className="flex justify-center gap-4">
                                <a
                                    href="#projects"
                                    className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-red-700"
                                >
                                    Lihat Proyek
                                </a>
                                <a
                                    href="#contact"
                                    className="rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition duration-300 hover:bg-gray-200"
                                >
                                    Hubungi Saya
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Proyek Popular Carousel */}
                <section id="projects" className="w-full py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">Proyek Populer</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Berikut adalah beberapa proyek terbaik yang telah saya kerjakan.
                                Swipe untuk melihat lebih banyak proyek.
                            </p>
                        </div>

                        {featuredProyeks.length > 0 ? (
                            <Swiper
                                slidesPerView={1}
                                spaceBetween={30}
                                pagination={{
                                    clickable: true,
                                }}
                                autoplay={{
                                    delay: 3500,
                                    disableOnInteraction: false,
                                }}
                                breakpoints={{
                                    640: {
                                        slidesPerView: 1,
                                    },
                                    768: {
                                        slidesPerView: 2,
                                    },
                                    1024: {
                                        slidesPerView: 3,
                                    },
                                }}
                                modules={[Pagination, Autoplay]}
                                className="mySwiper"
                            >
                                {featuredProyeks.map((proyek) => (
                                    <SwiperSlide key={proyek.id}>
                                        <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full flex flex-col">
                                            <div className="h-48 bg-gray-200">
                                                {/* <img
                                                    src={proyek.gambar || '/api/placeholder/400/320'}
                                                    alt={proyek.nama}
                                                    className="w-full h-full object-cover"
                                                /> */}
                                            </div>
                                            <div className="p-6 flex-1 flex flex-col">
                                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{proyek.judul}</h3>
                                                <p className="text-gray-600 mb-4 flex-1">{proyek.deskripsi}</p>
                                                <div className="flex justify-between items-center mt-auto">
                                                    <span className="bg-red-100 text-red-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                        {categories.find(k => k.id === proyek.kategori_proyek_id)?.nama || 'Uncategorized'}
                                                    </span>
                                                    <a href={route('showProyek', proyek.slug)} className="text-sm font-medium text-red-600 hover:text-red-800">
                                                        Detail →
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                            <div className="text-center p-8 bg-gray-50 rounded-lg">
                                <p className="text-gray-500">Belum ada proyek untuk ditampilkan.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Project Gallery Section with Filters */}
                <section className="w-full py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">Galeri Proyek</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Lihat semua proyek yang telah saya kerjakan berdasarkan kategori.
                            </p>
                        </div>

                        {/* Category Filters */}
                        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    activeTab === 'all'
                                        ? 'bg-red-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Semua
                            </button>
                            {categories.map((kategori) => (
                                <button
                                    key={kategori.id}
                                    onClick={() => setActiveTab(kategori.id.toString())}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                        activeTab === kategori.id.toString()
                                            ? 'bg-red-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {kategori.nama}
                                </button>
                            ))}
                        </div>

                        {/* Project Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProjects.length > 0 ? (
                                filteredProjects.map((proyek) => (
                                    <div key={proyek.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                        <div className="h-48 overflow-hidden">
                                            {/* <img
                                                src={proyek.deskripsi || '/api/placeholder/400/320'}
                                                alt={proyek.judul}
                                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                            /> */}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{proyek.judul}</h3>
                                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{proyek.deskripsi}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="bg-red-100 text-red-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                    {categories.find(k => k.id === proyek.kategori_proyek_id)?.nama || 'Uncategorized'}
                                                </span>
                                                <a href={route('showProyek', proyek.slug)} className="text-sm font-medium text-red-600 hover:text-red-800">
                                                    Detail →
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center p-8 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500">Tidak ada proyek dalam kategori ini.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Auto load page kategori & proyek */}
                <section className="container mx-auto px-4 py-16">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-700">Kategori Proyek</h2>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {categories.length > 0 ? (
                            categories.map((kategori) => (
                                <div key={kategori.id} className="rounded-lg bg-white p-4 text-center shadow">
                                    <span className="font-medium text-gray-800">{kategori.nama}</span>
                                </div>
                            ))
                        ) : (
                            <p className="col-span-4 text-gray-500">Belum ada kategori.</p>
                        )}
                    </div>
                </section>

                {/* Testimonials Section / Komentar User */}
                <section className="w-full py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">Testimonial</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Apa kata klien tentang pengalaman bekerja sama dengan saya
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {testimonials.map((testimonial) => (
                                <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md">
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 rounded-full mr-4 overflow-hidden">
                                            <img
                                                src={testimonial.image}
                                                alt={testimonial.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                                            <p className="text-sm text-gray-600">{testimonial.role}</p>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-gray-700 italic">{testimonial.content}</p>
                                    </div>

                                    <div className="flex">
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <svg
                                                key={index}
                                                className={`w-5 h-5 ${index < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="w-full py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="md:flex">
                                <div className="bg-red-600 text-white p-8 md:w-1/3">
                                    <h3 className="text-2xl font-bold mb-4">Kontak Info</h3>
                                    <p className="mb-6">Jangan ragu untuk menghubungi saya jika Anda memiliki pertanyaan atau ingin berdiskusi tentang proyek</p>

                                    <div className="flex items-center mb-4">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span>email@example.com</span>
                                    </div>

                                    <div className="flex items-center mb-4">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <span>+62 812 3456 7890</span>
                                    </div>

                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>Jakarta, Indonesia</span>
                                    </div>
                                </div>

                                <div className="p-8 md:w-2/3">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Kirim Pesan</h3>
                                    <form method="POST">
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
                                                Nama Lengkap
                                            </label>
                                            <input
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                                                type="text"
                                                id="name"
                                                name="name"
                                                placeholder="Nama Anda"
                                                required
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                                                Email
                                            </label>
                                            <input
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                                                type="email"
                                                id="email"
                                                name="email"
                                                placeholder="email@example.com"
                                                required
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="subject">
                                                Subject
                                            </label>
                                            <input
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                                                type="text"
                                                id="subject"
                                                name="subject"
                                                placeholder="Subject pesan"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="message">
                                                Pesan
                                            </label>
                                            <textarea
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                                                id="message"
                                                name="message"
                                                rows={4}
                                                placeholder="Tulis pesan Anda disini..."
                                                required
                                            ></textarea>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300"
                                        >
                                            Kirim Pesan
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Jadwal proyek baru  */}
                <section className="container mx-auto px-4 py-16">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-700">Jadwal Proyek</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full rounded-xl bg-white shadow">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700">
                                    <th className="px-4 py-2 text-left">Nama</th>
                                    <th className="px-4 py-2 text-left">Deskripsi</th>
                                    <th className="px-4 py-2 text-left">Mulai</th>
                                    <th className="px-4 py-2 text-left">Selesai</th>
                                    <th className="px-4 py-2 text-left">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {upcomingEvents.length > 0 ? (
                                    upcomingEvents.map((jadwal) => (
                                        <tr key={jadwal.id} className="border-b last:border-none">
                                            <td className="px-4 py-2">{jadwal.nama}</td>
                                            <td className="px-4 py-2">{jadwal.deskripsi || '-'}</td>
                                            <td className="px-4 py-2">{jadwal.start_time}</td>
                                            <td className="px-4 py-2">{jadwal.end_time || '-'}</td>
                                            <td className="px-4 py-2">
                                                <a
                                                    href={route('showJadwal', jadwal.id)}
                                                    className="text-sm font-medium text-red-600 hover:text-red-800"
                                                >
                                                    Detail →
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-4 text-center text-gray-500">
                                            Belum ada jadwal.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </WebLayouts>
    );
}
