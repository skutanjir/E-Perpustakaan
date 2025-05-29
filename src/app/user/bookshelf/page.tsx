"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Image from "next/image";
import { BookOpenIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { get } from "@/lib/api/apiService"; // Sesuaikan path ke file apiService Anda
import { jwtDecode } from 'jwt-decode';
import Cookies from "js-cookie";

// Interface (tidak berubah)
interface BukuPinjam { id: string; cover?: string; title: string; author: string; tanggalKembali: string; }
interface RiwayatPinjam { id: string; title: string; tanggalPinjam: string; tanggalKembali: string; status: 'Dikembalikan' | 'Terlambat'; }
interface DecodedToken { sub: string; }

export default function RakPinjam(): JSX.Element {
  const [view, setView] = useState<'pinjam' | 'riwayat'>('pinjam');
  const [pinnedBooks, setPinnedBooks] = useState<BukuPinjam[]>([]);
  const [riwayatPeminjaman, setRiwayatPeminjaman] = useState<RiwayatPinjam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndFilterData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = Cookies.get('accessToken');
        if (!token) {
          setError("Autentikasi gagal: Token tidak ditemukan.");
          setLoading(false);
          return;
        }

        const decodedToken = jwtDecode<DecodedToken>(token);
        const userId = decodedToken.sub;

        // Panggilan API sangat bersih. Logika token dan refresh terjadi di belakang layar.
        const response = await get<{ data: any[] }>(`/borrowings/history/${userId}`);
        const allBorrowings = response.data;

        // Logika filter dan mapping data... (tidak ada perubahan)
        const currentlyPinnedItems = allBorrowings.filter((item: any) => !item.returnedDate);
        const mappedPinned: BukuPinjam[] = currentlyPinnedItems.map((item: any) => ({
          id: item.id.toString(), cover: item.book.cover, title: item.book.title, author: item.book.author.name, tanggalKembali: item.returnDate,
        }));
        setPinnedBooks(mappedPinned);

        const historyItems = allBorrowings.filter((item: any) => item.returnedDate);
        const mappedHistory: RiwayatPinjam[] = historyItems.map((item: any) => {
          const returnDate = new Date(item.returnDate);
          const returnedDate = new Date(item.returnedDate);
          const status: 'Dikembalikan' | 'Terlambat' = returnedDate > returnDate ? 'Terlambat' : 'Dikembalikan';
          return {
            id: item.id.toString(), title: item.book.title, tanggalPinjam: item.borrowDate, tanggalKembali: item.returnDate, status: status,
          };
        });
        setRiwayatPeminjaman(mappedHistory);

      } catch (err: any) {
        console.error("Gagal mengambil data:", err);
        setError(err.error || err.message || "Terjadi kesalahan saat memuat data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilterData();
  }, []);

  // ... (Seluruh kode JSX dari `getDueDateInfo` hingga akhir tidak berubah)
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
    let text = `Kembali: ${formattedDate}`;
 
    if (diffDays < 0) {
        className = 'text-red-600 font-semibold';
        text = `Terlambat ${Math.abs(diffDays)} hari`;
    } else if (diffDays <= 2) {
        className = 'text-red-600 font-semibold';
    } else if (diffDays <= 7) {
        className = 'text-yellow-600 font-semibold';
    }
 
    return { text, className };
  };
 
  const getStatusBadge = (status: 'Dikembalikan' | 'Terlambat') => {
    switch (status) {
      case 'Dikembalikan': return <span className="px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">Dikembalikan</span>;
      case 'Terlambat': return <span className="px-3 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">Terlambat</span>;
      default: return null;
    }
  }
 
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-2">
            <ArrowPathIcon className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-gray-500">Memuat data...</p>
        </div>
      </div>
    )
  }
 
  if (error) {
     return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-red-600">Oops! Terjadi Kesalahan</h3>
            <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    )
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
                      {b.cover ? (
                        <Image
                          src={b.cover}
                          alt={b.title}
                          fill
                          className="rounded-lg"
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
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