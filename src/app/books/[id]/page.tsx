// Nama file: app/books/[id]/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; // DIUBAH: Impor useParams
import Header from "@/components/Header";
import Image from "next/image";
import { getBookByIsbn } from "@/lib/api/apiService";
import { Book } from "@/types";

// TIDAK PERLU PageProps lagi karena params diambil via hook
// interface PageProps {
//   params: {
//     id: string; 
//   };
// }

export default function BookDetailPage(): JSX.Element { // DIUBAH: Hapus params dari props
  const router = useRouter();
  const paramsFromHook = useParams<{ id: string }>(); // DIUBAH: Menggunakan hook useParams
  const { id } = paramsFromHook; // 'id' di sini berisi ISBN, diambil dari hasil hook

  const [buku, setBuku] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiBook = await getBookByIsbn(id as string); // id dari useParams bisa string | string[]
        if (apiBook) {
          setBuku(apiBook);
        } else {
          setError("Buku tidak ditemukan.");
        }
      } catch (err) {
        setError("Gagal memuat data buku.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]); // Tetap menggunakan id (yang sekarang dari useParams) sebagai dependency

  function handlePinjam() {
    router.push(`/books/borrowings/${id}`); 
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg text-gray-600">Memuat detail buku...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (!buku) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg text-gray-600">Buku tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <Header />
      <main className="flex items-center justify-center p-6 min-h-[80vh]">
        <section className="w-full max-w-3xl bg-gray-50 border border-gray-200 rounded-2xl p-8 shadow-lg relative z-10">
          <h2 className="text-2xl font-semibold text-black mb-6">
            Detail Buku
          </h2>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="w-56 h-56 relative rounded-xl overflow-hidden border-2 border-gray-300 flex-shrink-0">
              <Image
                src={buku.cover}
                alt={buku.title}
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className="text-3xl font-semibold text-gray-800 break-words"
                title={buku.title}
              >
                {buku.title}
              </h3>
              <p className="text-gray-600 mt-2">{buku.author.name}</p>
              <p className="text-gray-700 mt-4 leading-relaxed">{buku.description || 'Tidak ada deskripsi.'}</p>
              <button
                onClick={handlePinjam}
                className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-green-600 transition whitespace-nowrap"
              >
                Pinjam
              </button>
            </div>
          </div>

          <hr className="my-8 border-gray-300" />

          <div className="grid grid-cols-2 gap-y-4 text-gray-800">
            <span className="font-medium">Pengarang</span>
            <span className="text-gray-700">{buku.author.name}</span>

            <span className="font-medium">Tahun Terbit</span>
            <span className="text-gray-700">{buku.year}</span>

            <span className="font-medium">ISBN</span>
            <span className="text-gray-700">{buku.isbn}</span>

            <span className="font-medium">Kategori</span>
            <span className="text-gray-700">{buku.category?.name || '-'}</span>
            
            <span className="font-medium">Halaman</span>
            <span className="text-gray-700">{buku.pages || '-'}</span>
            
            <span className="font-medium">Bahasa</span>
            <span className="text-gray-700">{buku.language || '-'}</span>
          </div>
        </section>
      </main>
    </div>
  );
}