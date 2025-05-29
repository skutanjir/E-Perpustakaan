// Nama file: app/not-found.tsx
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react'; // --- BARU: Impor useEffect ---
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
// import type { Metadata } from 'next'; // --- DIHAPUS ---

// --- DIHAPUS: Objek metadata tidak bisa diekspor dari Client Component ---
// export const metadata: Metadata = {
// title: 'Halaman Tidak Ditemukan - NamaAplikasiAnda',
// description: 'Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.',
// };

export default function NotFound() {
  const router = useRouter();

  // --- BARU: Mengatur judul halaman menggunakan useEffect ---
  useEffect(() => {
    document.title = 'Halaman Tidak Ditemukan - NamaAplikasiAnda'; // Ganti NamaAplikasiAnda
  }, []); // Array dependency kosong agar hanya berjalan sekali saat mount

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4 py-16">
      <ExclamationTriangleIcon className="w-20 h-20 text-yellow-500 mb-8" />
      
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      
      <h2 className="text-3xl font-semibold text-gray-700 mb-6">
        Halaman Tidak Ditemukan
      </h2>
      
      <p className="text-lg text-gray-600 mb-10 max-w-md">
        Maaf, halaman yang Anda cari tidak ada atau mungkin telah dipindahkan.
        Silakan periksa kembali URL Anda.
      </p>
      
      <div className="flex space-x-4">
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-150"
        >
          Kembali ke Halaman Sebelumnya
        </button>
        <Link
          href="/beranda" 
          className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-150"
        >
          Ke Beranda
        </Link>
      </div>
    </div>
  );
}