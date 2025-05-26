

"use client";

import Header from "../../../components/HeaderAdmin"; // Sesuaikan path jika perlu
import Sidebar from "../../../components/sidebar";   // Sesuaikan path jika perlu
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Impor useRouter
import { motion, AnimatePresence } from "framer-motion";
// Impor ikon untuk modal notifikasi
import { ExclamationTriangleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";


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

// Data dummy statis (dalam aplikasi nyata, ini akan diambil dari API)
const bukuStatic: Buku = {
  cover: "/covers/seni-hidup-minimalis.jpg", // Pastikan path ini benar atau gambar ada di public
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

// Ganti nama komponen agar lebih deskriptif
export default function DetailBukuAdminPage({ params }: PageProps): JSX.Element {
  const { id } = params;
  const router = useRouter(); // Inisialisasi router

  const [buku, setBuku] = useState<Buku | null>(null);
  const [loadingData, setLoadingData] = useState(true); // State untuk loading data buku
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // --- State untuk Modal Notifikasi ---
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<"success" | "error">("error");

  // Fungsi untuk menampilkan notifikasi modal
  const showNotification = (message: string, type: "success" | "error") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotificationModal(true);
  };

  // Simulasi pengambilan data buku berdasarkan ID
  useEffect(() => {
    setLoadingData(true);
    // Di sini Anda akan melakukan fetch ke API Anda:
    // const fetchedBuku = await fetch(`/api/admin/buku/${id}`).then(res => res.json());
    // setBuku(fetchedBuku);
    
    // Untuk demo, kita gunakan data statis setelah jeda singkat
    setTimeout(() => {
      setBuku(bukuStatic); // Menggunakan data statis untuk contoh
      setLoadingData(false);
    }, 500); // Simulasi delay network
  }, [id]);

  function handleDeleteClick() {
    setShowDeleteConfirm(true);
  }

  function handleConfirmDelete() {
    setShowDeleteConfirm(false);
    // Ganti alert dengan notifikasi kustom
    showNotification(`Buku "${buku?.title}" dengan ID ${id} berhasil dihapus!`, "success");
    // Di sini akan ada logika untuk menghapus buku dari database
    // Setelah berhasil, mungkin navigasi ke halaman daftar buku:
    // router.push('/admin/buku'); 
    console.log(`Menghapus buku dengan ID: ${id}`);
  }

  function handleCancelDelete() {
    setShowDeleteConfirm(false);
  }

  function handleEditClick() {
    router.push(`/admin/edit-buku/${id}`); // Arahkan ke halaman edit
  }

  if (loadingData) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex items-center justify-center p-6 min-h-[80vh]">
            <p className="text-xl text-gray-700">Memuat data buku...</p>
          </main>
        </div>
      </div>
    );
  }

  if (!buku) {
    return (
       <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex items-center justify-center p-6 min-h-[80vh]">
            <p className="text-xl text-red-500">Data buku tidak ditemukan.</p>
          </main>
        </div>
      </div>
    );
  }


  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex items-center justify-center p-6 min-h-[calc(100vh-4rem)]"> {/* 4rem adalah tinggi header perkiraan */}
          <section className="w-full max-w-3xl bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-black mb-6">
              Detail Buku - ID: {id}
            </h2>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="w-full md:w-56 h-80 md:h-auto md:aspect-[3/4] relative rounded-xl overflow-hidden border-2 border-gray-200 flex-shrink-0 bg-gray-100">
                {buku.cover ? (
                    <Image
                        src={buku.cover} // Pastikan path ini valid dan domainnya dikonfigurasi di next.config.js jika eksternal
                        alt={buku.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span>Cover tidak tersedia</span>
                    </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className="text-3xl font-bold text-gray-800 break-words"
                  style={{ wordBreak: "break-word" }}
                  title={buku.title}
                >
                  {buku.title}
                </h3>
                <p className="text-gray-600 mt-2 text-lg">{buku.author}</p>
                <p className="text-gray-700 mt-4 leading-relaxed text-sm">{buku.description}</p>

                <div className="mt-6 flex gap-3 flex-wrap">
                  <button 
                    onClick={handleEditClick} // Tambahkan onClick handler
                    className="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition shadow-sm font-medium"
                  >
                    Edit Buku
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-sm font-medium"
                  >
                    Hapus Buku
                  </button>
                </div>
              </div>
            </div>

            <hr className="my-8 border-gray-300" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div className="font-medium text-gray-500">Pengarang</div>
              <div className="text-gray-800">{buku.author}</div>

              <div className="font-medium text-gray-500">Penerbit</div>
              <div className="text-gray-800">{buku.penerbit}</div>

              <div className="font-medium text-gray-500">Tahun Terbit</div>
              <div className="text-gray-800">{buku.tahun}</div>

              <div className="font-medium text-gray-500">EISBN</div>
              <div className="text-gray-800">{buku.eisbn}</div>

              <div className="font-medium text-gray-500">Kategori</div>
              <div className="text-gray-800">{buku.kategori}</div>
            </div>
          </section>

          {/* Modal Konfirmasi Hapus */}
          <AnimatePresence>
            {showDeleteConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-transparent bg-opacity-25 flex items-center justify-center z-50" // Latar belakang diubah
                onClick={handleCancelDelete}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="bg-white rounded-xl p-6 sm:p-8 max-w-md w-full shadow-xl m-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-center">
                    <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4"/>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Konfirmasi Hapus</h3>
                    <p
                        className="text-sm text-gray-600 mb-6 break-words"
                        style={{ wordBreak: "break-word" }}
                    >
                        Yakin ingin menghapus buku <br />
                        <span className="font-semibold text-gray-800">"{buku.title}"</span>?
                        <br/>Tindakan ini tidak dapat dibatalkan.
                    </p>
                  </div>
                  <div className="flex justify-center gap-4 flex-col sm:flex-row">
                    <button
                      onClick={handleCancelDelete}
                      className="w-full sm:w-auto px-6 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleConfirmDelete}
                      className="w-full sm:w-auto px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                    >
                      Ya, Hapus
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Modal Notifikasi (Error/Success) */}
          <AnimatePresence>
            {showNotificationModal && (
              <motion.div
                className="fixed inset-0 bg-transparent bg-opacity-25 flex items-center justify-center z-[100]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowNotificationModal(false)}
              >
                <motion.div
                  className={`bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center mx-4
                    border-t-4 ${notificationType === 'error' ? 'border-red-500' : 'border-green-500'}`}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {notificationType === 'error' ? (
                    <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  ) : (
                    <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  )}
                  <h3 className={`text-xl font-semibold mb-3 ${notificationType === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                    {notificationType === 'error' ? 'Terjadi Kesalahan' : 'Berhasil!'}
                  </h3>
                  <p className="text-gray-700 mb-6">{notificationMessage}</p>
                  <button
                    onClick={() => setShowNotificationModal(false)}
                    className={`w-full px-4 py-2 rounded-lg text-white font-medium transition-colors
                      ${notificationType === 'error' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                  >
                    Tutup
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}