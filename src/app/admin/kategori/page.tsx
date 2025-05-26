"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/HeaderAdmin"; // Sesuaikan path jika perlu
import Sidebar from "../../components/sidebar"; // Sesuaikan path jika perlu
import { HiPencil, HiTrash } from "react-icons/hi";
// Impor ikon untuk modal notifikasi
import { ExclamationTriangleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

interface Kategori {
  id: number;
  nama: string;
  deskripsi?: string;
}

const dummyData: Kategori[] = [
  { id: 1, nama: "Fiksi" },
  { id: 2, nama: "Non-Fiksi" },
  { id: 3, nama: "Teknologi" },
  { id: 4, nama: "Agama" },
  { id: 5, nama: "Sejarah" },
  { id: 6, nama: "Anak-anak" },
  { id: 7, nama: "Sains" },
  { id: 8, nama: "Bisnis" },
  { id: 9, nama: "Bahasa" },
  { id: 10, nama: "Kesehatan" },
  { id: 11, nama: "Seni" },
];

const PER_PAGE_OPTIONS = [5, 10, 20];

export default function KategoriPage() {
  const [data, setData] = useState<Kategori[]>(dummyData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteMultipleModal, setShowDeleteMultipleModal] = useState(false);

  const [editKategori, setEditKategori] = useState<Kategori | null>(null);
  const [deleteKategori, setDeleteKategori] = useState<Kategori | null>(null);

  const [inputNama, setInputNama] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(PER_PAGE_OPTIONS[0]);

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

  const filteredData = data.filter((kategori) =>
    kategori.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1); 
  }, [searchTerm, itemsPerPage]);

  const allSelectedOnPage =
    currentData.length > 0 &&
    currentData.every((item) => selectedIds.includes(item.id));
  const someSelectedOnPage =
    currentData.some((item) => selectedIds.includes(item.id)) && !allSelectedOnPage;

  function toggleSelectAll() {
    if (allSelectedOnPage) {
      setSelectedIds(selectedIds.filter((id) => !currentData.some((item) => item.id === id)));
    } else {
      const newIds = currentData
        .map((item) => item.id)
        .filter((id) => !selectedIds.includes(id));
      setSelectedIds([...selectedIds, ...newIds]);
    }
  }

  function toggleSelectOne(id: number) {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  }

  function handleAddKategori() {
    if (!inputNama.trim()) {
      showNotification("Nama kategori tidak boleh kosong.", "error");
      return;
    }
    if (data.some((d) => d.nama.toLowerCase() === inputNama.toLowerCase())) {
      showNotification("Kategori dengan nama tersebut sudah ada.", "error");
      return;
    }
    const newKategori: Kategori = {
      id: data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1,
      nama: inputNama.trim(),
    };
    setData([newKategori, ...data]);
    setInputNama("");
    setShowAddModal(false);
    showNotification(`Kategori "${newKategori.nama}" berhasil ditambahkan.`, "success");
  }

  function openEditModal(kategori: Kategori) {
    setEditKategori(kategori);
    setInputNama(kategori.nama);
    setShowEditModal(true);
  }

  function handleEditKategori() {
    if (!inputNama.trim()) {
      showNotification("Nama kategori tidak boleh kosong.", "error");
      return;
    }
    if (
      data.some(
        (d) =>
          d.nama.toLowerCase() === inputNama.toLowerCase() &&
          d.id !== (editKategori?.id ?? 0)
      )
    ) {
      showNotification("Kategori dengan nama tersebut sudah ada.", "error");
      return;
    }
    const updatedKategoriName = inputNama.trim();
    setData(
      data.map((d) =>
        d.id === editKategori?.id ? { ...d, nama: updatedKategoriName } : d
      )
    );
    setShowEditModal(false);
    setEditKategori(null);
    setInputNama("");
    showNotification(`Kategori "${updatedKategoriName}" berhasil diperbarui.`, "success");
  }

  function openDeleteModal(kategori: Kategori) {
    setDeleteKategori(kategori);
    setShowDeleteModal(true);
  }

  function handleDeleteKategori() {
    if (!deleteKategori) return;
    const kategoriNameToDelete = deleteKategori.nama;
    setData(data.filter((d) => d.id !== deleteKategori.id));
    setSelectedIds(selectedIds.filter((id) => id !== deleteKategori.id));
    setShowDeleteModal(false);
    setDeleteKategori(null);
    showNotification(`Kategori "${kategoriNameToDelete}" berhasil dihapus.`, "success");
  }

  function handleDeleteMultiple() {
    if (selectedIds.length === 0) {
      showNotification("Pilih kategori yang akan dihapus terlebih dahulu.", "error");
      return;
    }
    setShowDeleteMultipleModal(true);
  }

  function confirmDeleteMultiple() {
    const numDeleted = selectedIds.length;
    setData(data.filter((d) => !selectedIds.includes(d.id)));
    setSelectedIds([]);
    setShowDeleteMultipleModal(false);
    showNotification(`${numDeleted} kategori berhasil dihapus.`, "success");
  }

  // Fungsi goToPage tidak digunakan secara eksplisit lagi karena paginasi di-handle setCurrentPage
  // function goToPage(page: number) {
  //   if (page < 1 || page > totalPages) return;
  //   setCurrentPage(page);
  // }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="p-6 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold text-gray-800">Daftar Kategori</h1>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium"
              >
                + Tambah Kategori
              </button>
              <button
                type="button"
                onClick={handleDeleteMultiple}
                disabled={selectedIds.length === 0}
                className={`px-4 py-2 rounded-lg transition-colors shadow-sm font-medium ${
                  selectedIds.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-rose-600 text-white hover:bg-rose-700"
                }`}
              >
                Hapus Terpilih
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
            <div className="text-gray-700 text-sm">
              Menampilkan <span className="font-semibold">{currentData.length}</span> dari{" "}
              <span className="font-semibold">{filteredData.length}</span> data
            </div>
            <input
              type="text"
              placeholder="Cari kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm w-full max-w-xs focus:outline-none text-black focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4 flex items-center space-x-2">
            <label htmlFor="itemsPerPage" className="text-black text-sm font-semibold">
              Data per halaman:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border border-gray-300 text-black rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PER_PAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    <input
                      type="checkbox"
                      checked={allSelectedOnPage}
                      ref={(input) => { if (input) input.indeterminate = someSelectedOnPage; }}
                      onChange={toggleSelectAll}
                      aria-label="Select all categories on current page"
                      className="cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Nama Kategori
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                      Tidak ada data kategori ditemukan.
                    </td>
                  </tr>
                ) : (
                  currentData.map((kategori) => (
                    <tr key={kategori.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(kategori.id)}
                          onChange={() => toggleSelectOne(kategori.id)}
                          aria-label={`Select kategori ${kategori.nama}`}
                          className="cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {kategori.nama}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-3">
                          <button
                            onClick={() => openEditModal(kategori)}
                            className="flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors duration-200 text-sm font-medium"
                            aria-label={`Edit kategori ${kategori.nama}`}
                          >
                            <HiPencil />
                            Edit
                          </button>
                          <button
                            onClick={() => openDeleteModal(kategori)}
                            className="flex items-center gap-2 px-3 py-1 bg-rose-100 text-rose-700 rounded-md hover:bg-rose-200 transition-colors duration-200 text-sm font-medium"
                            aria-label={`Hapus kategori ${kategori.nama}`}
                          >
                            <HiTrash />
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className={`px-3 py-1 rounded border border-black text-black hover:bg-black hover:text-white transition ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded border border-black text-black hover:bg-black hover:text-white transition ${
                  currentPage === page ? "bg-black text-white" : ""
                }`}
              >
                {page}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(currentPage + 1)}
              className={`px-3 py-1 rounded border border-black text-black hover:bg-black hover:text-white transition ${
                currentPage === totalPages || totalPages === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Next
            </button>
          </div>

          {/* Modal Tambah */}
          <AnimatePresence>
            {showAddModal && (
              <motion.div
                className="fixed inset-0 bg-transparent bg-opacity-25 flex items-center justify-center z-50" // Latar belakang diubah
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowAddModal(false)}
              >
                <motion.div
                  className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full"
                  initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-lg font-semibold mb-4 text-black">Tambah Kategori</h3>
                  <input
                    type="text"
                    placeholder="Nama kategori"
                    value={inputNama}
                    onChange={(e) => setInputNama(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex justify-end space-x-2">
                    <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors shadow-sm font-medium">
                      Batal
                    </button>
                    <button onClick={handleAddKategori} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium">
                      Simpan
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Modal Edit */}
          <AnimatePresence>
            {showEditModal && editKategori && (
              <motion.div className="fixed inset-0 bg-transparent bg-opacity-25 flex items-center justify-center z-50" // Latar belakang diubah
                onClick={() => { setShowEditModal(false); setInputNama(""); }}>
                <motion.div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
                  <h3 className="text-lg font-semibold mb-4 text-black">Edit Kategori</h3>
                  <input
                    type="text"
                    placeholder="Nama kategori"
                    value={inputNama}
                    onChange={(e) => setInputNama(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex justify-end space-x-2">
                    <button onClick={() => { setShowEditModal(false); setInputNama(""); }} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors shadow-sm font-medium">
                      Batal
                    </button>
                    <button onClick={handleEditKategori} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium">
                      Simpan Perubahan
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Modal Hapus Satu */}
          <AnimatePresence>
            {showDeleteModal && deleteKategori && (
              <motion.div className="fixed inset-0 bg-transparent bg-opacity-25 flex items-center justify-center z-50" // Latar belakang diubah
                onClick={() => setShowDeleteModal(false)}>
                <motion.div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
                  <h3 className="text-lg text-black font-semibold mb-4">Konfirmasi Hapus</h3>
                  <p className="mb-6 text-gray-700">
                    Apakah yakin ingin menghapus kategori{" "}
                    <strong>{deleteKategori.nama}</strong>?
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button onClick={() => setShowDeleteModal(false)} className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors shadow-sm font-medium">
                      Batal
                    </button>
                    <button onClick={handleDeleteKategori} className="bg-rose-600 text-white px-5 py-2 rounded-lg hover:bg-rose-700 transition-colors shadow-sm font-medium">
                      Hapus
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Modal Hapus Multiple */}
          <AnimatePresence>
            {showDeleteMultipleModal && (
              <motion.div className="fixed inset-0 bg-transparent bg-opacity-25 flex items-center justify-center z-50" // Latar belakang diubah
                onClick={() => setShowDeleteMultipleModal(false)}>
                <motion.div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
                  <h3 className="text-lg text-black font-semibold mb-4">Konfirmasi Hapus</h3>
                  <p className="mb-6 text-gray-700">
                    Apakah yakin ingin menghapus{" "}
                    <strong>{selectedIds.length}</strong> kategori yang dipilih?
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button onClick={() => setShowDeleteMultipleModal(false)} className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors shadow-sm font-medium">
                      Batal
                    </button>
                    <button onClick={confirmDeleteMultiple} className="bg-rose-600 text-white px-5 py-2 rounded-lg hover:bg-rose-700 transition-colors shadow-sm font-medium">
                      Hapus
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* --- Modal Notifikasi (Error/Success) --- */}
          <AnimatePresence>
            {showNotificationModal && (
              <motion.div
                className="fixed inset-0 bg-transparent bg-opacity-25 flex items-center justify-center z-[100]" // z-index lebih tinggi
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