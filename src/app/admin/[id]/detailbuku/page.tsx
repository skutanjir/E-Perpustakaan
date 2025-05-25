"use client";

import Header from "../../../components/HeaderAdmin";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function AdminPage({ params }: PageProps): JSX.Element {
  const { id } = params;
  const buku = bukuStatic;

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  function handleDeleteClick() {
    setShowDeleteConfirm(true);
  }

  function handleConfirmDelete() {
    setShowDeleteConfirm(false);
    alert(`Buku "${buku.title}" dengan ID ${id} berhasil dihapus!`);
    // logika hapus buku sesuai id
  }

  function handleCancelDelete() {
    setShowDeleteConfirm(false);
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

              <div className="mt-6 flex gap-4 flex-wrap">
                <button className="px-6 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition whitespace-nowrap">
                  Edit
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition whitespace-nowrap"
                >
                  Delete
                </button>
              </div>
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

        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
              onClick={handleCancelDelete}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <p
                  className="text-lg text-black font-semibold mb-6 text-center break-words overflow-wrap-anywhere"
                  style={{ wordBreak: "break-word" }}
                >
                  Yakin ingin menghapus buku <br />
                  <span className="font-bold">"{buku.title}"</span>?
                </p>
                <div className="flex justify-center gap-6 flex-wrap">
                  <button
                    onClick={handleConfirmDelete}
                    className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition whitespace-nowrap"
                  >
                    Ok
                  </button>
                  <button
                    onClick={handleCancelDelete}
                    className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-red-700 transition whitespace-nowrap"
                  >
                    Batal
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
