"use client";

import Header from "../../../components/Header";
import Image from "next/image";

interface Buku {
  cover: string;
  title: string;
  author: string;
  description: string;
  penerbit: string;
  tahun: string;
  eisbn: string;
  kategori: string;
}

const bukuStatic: Buku = {
  cover: "/covers/seni-hidup-minimalis.jpg",
  title:
    "Seni Hidup Minimalis dengan Judul Sangat Panjang Sekali Supaya Bisa Dicek Responsivenya",
  author: "Francine Jay",
  description:
    "Deskripsi Singkat: Buku ini membahas prinsip-prinsip hidup minimalis, termasuk metode STREAMLINE yang membantu pembaca menyederhanakan kehidupan mereka dengan mengurangi kepemilikan barang yang tidak perlu.",
  penerbit: "Gramedia Pustaka Utama",
  tahun: "2019 (Cetakan ke-3)",
  eisbn: "978-602-03-3147-2",
  kategori: "Pengembangan Diri / Gaya Hidup",
};

interface PageProps {
  params: {
    id: string;
  };
}

export default function MahasiswaPage({ params }: PageProps): JSX.Element {
  const { id } = params;
  const buku = bukuStatic;

  function handlePinjam() {
    alert(`Meminjam buku "${buku.title}" dengan ID ${id}`);
    // logika pinjam buku bisa ditambahkan di sini
  }

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <Header />

      <main className="flex items-center justify-center p-6 min-h-[80vh]">
        <section className="w-full max-w-3xl bg-gray-50 border border-gray-200 rounded-2xl p-8 shadow-lg relative z-10">
          <h2 className="text-2xl font-semibold text-black mb-6">
            Detail Buku - ID BUKU: {id}
          </h2>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="w-56 h-56 relative rounded-xl overflow-hidden border-2 border-gray-300 flex-shrink-0">
              <Image
                src={buku.cover}
                alt={buku.title}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className="text-3xl font-semibold text-gray-800 break-words overflow-wrap-anywhere"
                style={{ wordBreak: "break-word" }}
                title={buku.title}
              >
                {buku.title}
              </h3>
              <p className="text-gray-600 mt-2">{buku.author}</p>
              <p className="text-gray-700 mt-4 leading-relaxed">{buku.description}</p>

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
            <span className="text-gray-700">{buku.author}</span>

            <span className="font-medium">Penerbit</span>
            <span className="text-gray-700">{buku.penerbit}</span>

            <span className="font-medium">Tahun Terbit</span>
            <span className="text-gray-700">{buku.tahun}</span>

            <span className="font-medium">EISBN</span>
            <span className="text-gray-700">{buku.eisbn}</span>

            <span className="font-medium">Kategori</span>
            <span className="text-gray-700">{buku.kategori}</span>
          </div>
        </section>
      </main>
    </div>
  );
}
