// app/rak-pinjam/page.tsx
"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Image from "next/image";
import { BookOpenIcon } from "@heroicons/react/24/outline";

// 1. Perbarui interface, cover bisa null atau tidak ada (opsional)
interface BukuPinjam {
  id: string;
  cover?: string; // Tanda tanya (?) berarti properti ini opsional
  title: string;
  author: string;
  tanggalKembali: string;
}

interface RiwayatPinjam {
  id: string;
  title: string;
  tanggalPinjam: string;
  tanggalKembali: string;
  status: 'Dikembalikan' | 'Terlambat';
}

// Data dummy dengan satu contoh buku tanpa cover
const initialPinned: BukuPinjam[] = [
  {
    id: "1",
    title: "Seni Hidup Minimalis",
    author: "Francine Jay",
    tanggalKembali: "2025-05-28",
  },
  // 2. Contoh buku tanpa cover
  {
    id: "5",
    // tidak ada properti 'cover'
    title: "Buku Tanpa Cover",
    author: "Penulis Imajinatif",
    tanggalKembali: "2025-06-20", 
  },
  {
    id: "2",
    title: "Atomic Habits",
    author: "James Clear",
    tanggalKembali: "2025-06-01",
  },
  {
    id: "3",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    tanggalKembali: "2025-06-15",
  },
   {
    id: "4",
    title: "Sebuah Seni Bersikap Bodo Amat",
    author: "Mark Manson",
    tanggalKembali: "2025-05-25",
  },
];

const initialHistory: RiwayatPinjam[] = [
    { id: 'h1', title: 'Filosofi Teras', tanggalPinjam: '2025-05-01', tanggalKembali: '2025-05-15', status: 'Dikembalikan' },
    { id: 'h2', title: 'Sapiens: A Brief History of Humankind', tanggalPinjam: '2025-04-20', tanggalKembali: '2025-05-05', status: 'Terlambat' },
];

export default function RakPinjam(): JSX.Element {
  const [view, setView] = useState<'pinjam' | 'riwayat'>('pinjam');
  const [pinnedBooks, setPinnedBooks] = useState<BukuPinjam[]>(initialPinned);
  const [riwayatPeminjaman, setRiwayatPeminjaman] = useState<RiwayatPinjam[]>(initialHistory);

  const getDueDateInfo = (dueDateStr: string): { text: string; className: string } => {
    const dueDate = new Date(dueDateStr);
    const today = new Date();
    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formattedDate = new Date(dueDateStr).toLocaleDateString('id-ID', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
    
    let className = 'text-gray-500';
    if (diffDays <= 2) className = 'text-red-600 font-semibold';
    else if (diffDays <= 7) className = 'text-yellow-600 font-semibold';

    return { text: `Kembali: ${formattedDate}`, className };
  };

  const getStatusBadge = (status: 'Dikembalikan' | 'Terlambat') => {
    switch (status) {
        case 'Dikembalikan': return <span className="px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">Dikembalikan</span>;
        case 'Terlambat': return <span className="px-3 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">Terlambat</span>;
        default: return null;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Header />
      <main className="max-w-4xl mx-auto my-8 p-6 bg-white border border-gray-200 rounded-2xl shadow-lg">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mb-4 shadow-md">
            <BookOpenIcon className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Rak Pinjam</h2>
          <p className="text-gray-500">Aktivitas peminjaman Anda tersimpan di sini</p>
        </div>

        <hr className="my-6 border-gray-200" />

        <div className="flex justify-center space-x-2 sm:space-x-4 mb-8">
          <button onClick={() => setView('pinjam')} className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${view === 'pinjam' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            Sedang Dipinjam
          </button>
          <button onClick={() => setView('riwayat')} className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${view === 'riwayat' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            Riwayat Peminjaman
          </button>
        </div>

        {view === 'pinjam' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
            {pinnedBooks.length > 0 ? pinnedBooks.map(b => {
                const dueDateInfo = getDueDateInfo(b.tanggalKembali);
                return (
                  <div key={b.id} className="flex flex-col group">
                    <div className="w-full aspect-[3/4] relative shadow-lg rounded-lg transform group-hover:-translate-y-2 transition-transform duration-300 bg-gray-200 border border-gray-300">
                      {/* 3. Logika untuk menampilkan cover atau fallback */}
                      {b.cover ? (
                        <Image
                          src={b.cover}
                          alt={b.title}
                          fill
                          className="rounded-lg"
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-4 bg-blue-800 rounded-lg">
                            <p className="text-white text-center font-bold text-lg">{b.title}</p>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 text-center">
                        <p className="font-semibold text-sm text-gray-800 line-clamp-2">{b.title}</p>
                        <p className="text-xs text-gray-500 mb-1">{b.author}</p>
                        <p className={`text-xs mt-1 ${dueDateInfo.className}`}>{dueDateInfo.text}</p>
                    </div>
                  </div>
                )
              })
              : <p className="text-center col-span-full text-gray-500">Anda tidak sedang meminjam buku.</p>
            }
          </div>
        )}

        {view === 'riwayat' && (
           <div className="overflow-x-auto">
             {riwayatPeminjaman.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul Buku</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Pinjam</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Kembali</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {riwayatPeminjaman.map(r => (
                            <tr key={r.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{r.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(r.tanggalPinjam).toLocaleDateString('id-ID')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(r.tanggalKembali).toLocaleDateString('id-ID')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getStatusBadge(r.status)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
              )
              : <p className="text-center col-span-full text-gray-500">Belum ada riwayat peminjaman.</p>
            }
           </div>
        )}
      </main>
    </div>
  );
}