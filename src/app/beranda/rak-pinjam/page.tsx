// app/rak-pinjam/page.tsx
"use client";

import React, { useState } from "react";
import Header from "../../components/Header";
import Image from "next/image";
import { BookOpenIcon } from "@heroicons/react/24/outline";

interface Buku {
  id: string;
  cover: string;
  title: string;
  author: string;
}

// Dummy data untuk rak pinjam
const initialPinned: Buku[] = [
  {
    id: "1",
    cover: "/covers/seni-hidup-minimalis.jpg",
    title: "Seni Hidup Minimalis",
    author: "Francine Jay",
  },
];

export default function RakPinjam(): JSX.Element {
  const [view, setView] = useState<'pinjam'|'riwayat'>('pinjam');
  const [books, setBooks] = useState<Buku[]>(initialPinned);

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Header />
      <main className="max-w-4xl mx-auto my-8 p-6 bg-white border border-gray-300 rounded-2xl shadow-lg">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-gradient-to-b from-blue-500 to-gray-200 rounded-full flex items-center justify-center mb-4">
            <BookOpenIcon className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-blue-600">Rak Pinjam</h2>
          <p className="text-gray-600">Aktivitas Anda akan tersimpan di halaman ini</p>
        </div>

        <hr className="my-6 border-gray-300 rotate-[0.5deg]" />

        {/* Tabs */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setView('pinjam')}
            className={`px-6 py-2 rounded-full transition ${view === 'pinjam'
              ? 'bg-blue-800 text-white'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            Pinjam
          </button>
          <button
            onClick={() => setView('riwayat')}
            className={`px-6 py-2 rounded-full transition ${view === 'riwayat'
              ? 'bg-blue-800 text-white'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            Riwayat
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {view === 'pinjam'
            ? books.map(b => (
              <div key={b.id} className="flex flex-col items-center">
                <div className="w-full pb-[100%] relative">
                  <Image
                    src={b.cover}
                    alt={b.title}
                    fill
                    className="rounded-xl border border-gray-300"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <p className="mt-3 text-center text-sm font-medium text-gray-800 line-clamp-1">
                  {b.title}
                </p>
                <p className="text-center text-xs text-gray-600">{b.author}</p>
              </div>
            ))
            : (
              <p className="text-center col-span-full text-gray-500">Belum ada riwayat peminjaman.</p>
            )
          }
        </div>
      </main>
    </div>
  );
}
