"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // import framer-motion
import Header from "../../components/HeaderAdmin";
import Sidebar from "../../components/sidebar";

// 1. Mengubah interface dari Kategori menjadi Author
interface Author {
  id: number;
  nama: string;
  bio?: string; // Menambahkan properti opsional untuk bio
}

// 2. Mengganti dummyData dengan data para penulis
const dummyData: Author[] = [
  { id: 1, nama: "J.K. Rowling" },
  { id: 2, nama: "Tere Liye" },
  { id: 3, nama: "George Orwell" },
  { id: 4, nama: "Andrea Hirata" },
  { id: 5, nama: "Pramoedya Ananta Toer" },
  { id: 6, "nama": "Haruki Murakami" },
  { id: 7, nama: "Dee Lestari" },
  { id: 8, nama: "Agatha Christie" },
  { id: 9, nama: "Eka Kurniawan" },
  { id: 10, nama: "Stephen King" },
  { id: 11, nama: "Ahmad Tohari" },
];

const PER_PAGE_OPTIONS = [5, 10, 20];

export default function AuthorPage() {
  // 3. Menyesuaikan nama state agar sesuai dengan konteks "Author"
  const [data, setData] = useState<Author[]>(dummyData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(PER_PAGE_OPTIONS[0]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteMultipleModal, setShowDeleteMultipleModal] = useState(false);

  const [editAuthor, setEditAuthor] = useState<Author | null>(null);
  const [deleteAuthor, setDeleteAuthor] = useState<Author | null>(null);

  const [inputNama, setInputNama] = useState("");

  const filteredData = data.filter((author) =>
    author.nama.toLowerCase().includes(searchTerm.toLowerCase())
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
  
  // 4. Mengubah fungsi handleAddKategori menjadi handleAddAuthor
  function handleAddAuthor() {
    if (!inputNama.trim()) {
      alert("Nama author tidak boleh kosong.");
      return;
    }
    if (data.some((d) => d.nama.toLowerCase() === inputNama.toLowerCase())) {
      alert("Author dengan nama tersebut sudah ada.");
      return;
    }
    const newAuthor: Author = {
      id: data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1,
      nama: inputNama.trim(),
    };
    setData([newAuthor, ...data]);
    setInputNama("");
    setShowAddModal(false);
  }

  function openEditModal(author: Author) {
    setEditAuthor(author);
    setInputNama(author.nama);
    setShowEditModal(true);
  }

  function handleEditAuthor() {
    if (!inputNama.trim()) {
      alert("Nama author tidak boleh kosong.");
      return;
    }
    if (
      data.some(
        (d) =>
          d.nama.toLowerCase() === inputNama.toLowerCase() &&
          d.id !== (editAuthor?.id ?? 0)
      )
    ) {
      alert("Author dengan nama tersebut sudah ada.");
      return;
    }
    setData(
      data.map((d) =>
        d.id === editAuthor?.id ? { ...d, nama: inputNama.trim() } : d
      )
    );
    setShowEditModal(false);
    setEditAuthor(null);
    setInputNama("");
  }

  function openDeleteModal(author: Author) {
    setDeleteAuthor(author);
    setShowDeleteModal(true);
  }

  function handleDeleteAuthor() {
    if (!deleteAuthor) return;
    setData(data.filter((d) => d.id !== deleteAuthor.id));
    setSelectedIds(selectedIds.filter((id) => id !== deleteAuthor.id));
    setShowDeleteModal(false);
    setDeleteAuthor(null);
  }

  function handleDeleteMultiple() {
    if (selectedIds.length === 0) {
      alert("Pilih author yang akan dihapus terlebih dahulu.");
      return;
    }
    setShowDeleteMultipleModal(true);
  }

  function confirmDeleteMultiple() {
    setData(data.filter((d) => !selectedIds.includes(d.id)));
    setSelectedIds([]);
    setShowDeleteMultipleModal(false);
  }

  function goToPage(page: number) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="p-6 overflow-auto">
          {/* 5. Mengubah semua teks UI dari "Kategori" menjadi "Author" */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold text-gray-800">Daftar Author</h1>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                + Tambah Author
              </button>
              <button
                type="button"
                onClick={handleDeleteMultiple}
                disabled={selectedIds.length === 0}
                className={`px-4 py-2 rounded ${
                  selectedIds.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                } transition-colors`}
              >
                Hapus Terpilih
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
            <div className="text-gray-700 text-sm">
              Menampilkan{" "}
              <span className="font-semibold">{currentData.length}</span> dari{" "}
              <span className="font-semibold">{filteredData.length}</span> data
            </div>
            <input
              type="text"
              placeholder="Cari author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm w-full max-w-xs focus:outline-none text-black focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4 flex items-center space-x-2">
            <label
              htmlFor="itemsPerPage"
              className="text-black text-sm font-semibold"
            >
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
                      ref={(input) => {
                        if (input) input.indeterminate = someSelectedOnPage;
                      }}
                      onChange={toggleSelectAll}
                      aria-label="Select all authors on current page"
                      className="cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Nama Author
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                    >
                      Tidak ada data author ditemukan.
                    </td>
                  </tr>
                ) : (
                  currentData.map((author) => (
                    <tr
                      key={author.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(author.id)}
                          onChange={() => toggleSelectOne(author.id)}
                          aria-label={`Select author ${author.nama}`}
                          className="cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {author.nama}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm space-x-2">
                        <button
                          onClick={() => openEditModal(author)}
                          className="text-blue-600 hover:underline"
                          aria-label={`Edit author ${author.nama}`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(author)}
                          className="text-red-600 hover:underline"
                          aria-label={`Hapus author ${author.nama}`}
                        >
                          Hapus
                        </button>
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
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className={`px-3 py-1 rounded border border-black text-black hover:bg-black hover:text-white transition ${
                currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Next
            </button>
          </div>

          {/* Modal Tambah Author */}
          <AnimatePresence>
            {showAddModal && (
              <motion.div
                className="fixed inset-0 bg-transparent bg-opacity-30 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddModal(false)}
              >
                <motion.div
                  className="bg-white rounded shadow-lg p-6 max-w-sm w-full"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-lg font-semibold mb-4 text-black">Tambah Author</h3>
                  <input
                    type="text"
                    placeholder="Nama author"
                    value={inputNama}
                    onChange={(e) => setInputNama(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 rounded border text-black border-gray-300 hover:bg-gray-100"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleAddAuthor}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Simpan
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Modal Edit Author */}
          <AnimatePresence>
            {showEditModal && (
              <motion.div
                className="fixed inset-0 bg-transparent bg-opacity-30 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowEditModal(false)}
              >
                <motion.div
                  className="bg-white rounded shadow-lg p-6 max-w-sm w-full"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-lg font-semibold mb-4 text-black">Edit Author</h3>
                  <input
                    type="text"
                    placeholder="Nama author"
                    value={inputNama}
                    onChange={(e) => setInputNama(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 rounded border text-black border-gray-300 hover:bg-gray-100"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleEditAuthor}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Simpan
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Modal Hapus Satu Author */}
          <AnimatePresence>
            {showDeleteModal && deleteAuthor && (
              <motion.div
                className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowDeleteModal(false)}
              >
                <motion.div
                  className="bg-white rounded shadow-lg p-6 max-w-sm w-full text-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-lg text-black font-semibold mb-4">
                    Konfirmasi Hapus
                  </h3>
                  <p className="mb-6 text-gray-700">
                    Apakah yakin ingin menghapus author{" "}
                    <strong>{deleteAuthor.nama}</strong>?
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="px-5 py-2 rounded border border-gray-300 text-black hover:bg-gray-100"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleDeleteAuthor}
                      className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700"
                    >
                      Hapus
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Modal Hapus Multiple Author */}
          <AnimatePresence>
            {showDeleteMultipleModal && (
              <motion.div
                className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowDeleteMultipleModal(false)}
              >
                <motion.div
                  className="bg-white rounded shadow-lg p-6 max-w-sm w-full text-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-lg text-black font-semibold mb-4">
                    Konfirmasi Hapus
                  </h3>
                  <p className="mb-6 text-gray-700">
                    Apakah yakin ingin menghapus{" "}
                    <strong>{selectedIds.length}</strong> author yang dipilih?
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => setShowDeleteMultipleModal(false)}
                      className="px-5 py-2 rounded border border-gray-300 text-black hover:bg-gray-100"
                    >
                      Batal
                    </button>
                    <button
                      onClick={confirmDeleteMultiple}
                      className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700"
                    >
                      Hapus
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}