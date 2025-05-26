"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/HeaderAdmin";
import Sidebar from "@/components/sidebar";
import Link from "next/link";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { FiCamera } from "react-icons/fi";

// --- INTERFACES ---
interface Book {
  id: number;
  title: string;
}

interface Loan {
  id: number;
  title: string;
  bookId: string;
  name: string;
  nrp: string;
  tglPinjam: string;
  tglKembali: string;
}

interface Return extends Loan {
  tglDikembalikan: string;
  isLate: boolean;
}

// --- DATA AWAL (DUMMY DATA) ---
const initialBooks: Book[] = [
    { id: 1, title: "Seni Memahami Hidup Minimalis" },
    { id: 2, title: "Dia adalah Dilanku Tahun 1990" },
    { id: 3, title: "Filosofi Teras" },
    { id: 4, title: "Selamat Tinggal" },
    { id: 5, title: "Timun Jelita" },
    { id: 6, title: "Tanah Para Bandit" },
    { id: 7, title: "Atmosphere" },
];

const initialPeminjamans: Loan[] = [
  { id: 1, title: "Kata", bookId: "9786020646200", name: "Nasya", nrp: "3124500000", tglPinjam: "2025-05-10", tglKembali: "2025-05-17" },
  { id: 2, title: "Dilan", bookId: "9786027870813", name: "Kiara", nrp: "3124600000", tglPinjam: "2025-05-20", tglKembali: "2025-05-27" },
  { id: 3, title: "Filosofi Teras", bookId: "9786020383", name: "Budi", nrp: "3124700000", tglPinjam: "2025-05-15", tglKembali: "2025-05-22" },
];

const initialPengembalians: Return[] = [
  { id: 1, title: "Laskar Pelangi", bookId: "9789793062798", name: "Sari", nrp: "3124800000", tglPinjam: "2025-05-01", tglKembali: "2025-05-08", tglDikembalikan: "2025-05-10", isLate: true },
  { id: 2, title: "Bumi Manusia", bookId: "9789799731234", name: "Joko", nrp: "3124900000", tglPinjam: "2025-05-05", tglKembali: "2025-05-12", tglDikembalikan: "2025-05-11", isLate: false },
];

export default function Page() {
  // State untuk data dan UI
  const [activeTab, setActiveTab] = useState<"buku" | "peminjaman" | "pengembalian">("buku");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  
  // State untuk data yang bisa berubah
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [peminjamans, setPeminjamans] = useState<Loan[]>(initialPeminjamans);
  const [pengembalians, setPengembalians] = useState<Return[]>(initialPengembalians);

  // State untuk filter dan search
  const [searchTerm, setSearchTerm] = useState("");
  const [returnFilter, setReturnFilter] = useState<"all" | "late" | "ontime">("all");
  
  // State untuk modal
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Fungsi untuk memfilter dan mencari data sesuai tab aktif
  const filteredAndSearchedData = () => {
    let currentData: any[] = [];
    if (activeTab === 'buku') {
      currentData = books.filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase()));
    } else if (activeTab === 'peminjaman') {
      currentData = peminjamans.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.nrp.includes(searchTerm)
      );
    } else if (activeTab === 'pengembalian') {
      let filtered = pengembalians;
      if (returnFilter === 'late') {
        filtered = pengembalians.filter(p => p.isLate);
      } else if (returnFilter === 'ontime') {
        filtered = pengembalians.filter(p => !p.isLate);
      }
      currentData = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.nrp.includes(searchTerm)
      );
    }
    return currentData;
  };

  const data = filteredAndSearchedData();
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const pagedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
    setSearchTerm("");
    setReturnFilter("all");
  }, [activeTab]);

  const openReturnModal = (loan: Loan) => {
    setSelectedLoan(loan);
    setShowReturnModal(true);
  };

  // Fungsi untuk memproses pengembalian buku
  const handleReturnBook = () => {
    if (!selectedLoan) return;
    setPeminjamans(peminjamans.filter(p => p.id !== selectedLoan.id));
    const returnDate = new Date();
    const dueDate = new Date(selectedLoan.tglKembali);
    const newReturn: Return = {
      ...selectedLoan,
      id: pengembalians.length + 1,
      tglDikembalikan: returnDate.toISOString().split('T')[0],
      isLate: returnDate > dueDate,
    };
    setPengembalians([newReturn, ...pengembalians]);
    setShowReturnModal(false);
    setSelectedLoan(null);
  };
  
  // Hook untuk mengelola siklus hidup QR Code Scanner
  useEffect(() => {
    if (!isScannerOpen) {
      return;
    }

    const qrCodeRegionId = "qr-reader";
    const html5QrCode = new Html5Qrcode(qrCodeRegionId);

    const onScanSuccess = (decodedText: string) => {
      html5QrCode.pause();
      const scannedId = decodedText;
      const foundLoan = peminjamans.find(p => p.id.toString() === scannedId);
      
      if (foundLoan) {
        setIsScannerOpen(false);
        openReturnModal(foundLoan);
      } else {
        alert(`Peminjaman dengan ID "${scannedId}" tidak ditemukan.`);
        setTimeout(() => {
          if (html5QrCode.getState() === Html5QrcodeScannerState.PAUSED) {
            html5QrCode.resume();
          }
        }, 1000);
      }
    };
    
    const startScanner = async () => {
      try {
        await html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          onScanSuccess,
          (errorMessage) => {}
        );
      } catch (err) {
        console.error("Gagal memulai QR scanner:", err);
        alert("Tidak dapat memulai kamera. Pastikan Anda telah memberikan izin pada browser.");
        setIsScannerOpen(false);
      }
    };
    
    startScanner();

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(err => {
          console.error("Gagal menghentikan QR scanner dengan benar:", err);
        });
      }
    };
  }, [isScannerOpen, peminjamans]);

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 bg-gray-50">
        <Header />
        <main className="px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Jumlah Buku", value: books.length },
              { label: "Sedang Dipinjam", value: peminjamans.length },
              { label: "Rata-rata Traffic/Bulan", value: 15 },
              { label: "Buku Telat", value: pengembalians.filter(r => r.isLate).length, isHighlight: true },
            ].map(({ label, value, isHighlight }, i) => (
              <div
                key={i}
                className={`relative bg-white rounded-2xl shadow-md p-4 border ${
                  isHighlight ? "border-red-400" : "border-gray-300"
                }`}
              >
                <h3 className="text-sm text-gray-500">{label}</h3>
                <p className={`text-2xl font-bold ${isHighlight ? "text-red-700" : "text-gray-800"}`}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          <nav className="flex gap-4 mb-8">
            {["buku", "peminjaman", "pengembalian"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2 rounded-full font-medium transition ${
                  activeTab === tab ? "bg-[#678D7D] text-white" : "border border-[#678D7D] text-[#678D7D]"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
          
          <div className="bg-white border border-gray-300 rounded-2xl p-4 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
              <div className="flex w-full md:w-auto gap-2">
                <input
                  type="text"
                  placeholder={`Cari di ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#678D7D]"
                />
                {activeTab === 'peminjaman' && (
                  <button
                    onClick={() => setIsScannerOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#678D7D] text-white rounded-lg hover:bg-[#5a776d] transition"
                  >
                    <FiCamera />
                    <span>Scan</span>
                  </button>
                )}
              </div>
              
              {activeTab === 'pengembalian' && (
                <div className="flex gap-2">
                  <button onClick={() => setReturnFilter('all')} className={`px-4 py-1 rounded-full text-sm ${returnFilter === 'all' ? 'bg-[#678D7D] text-white' : 'bg-gray-200 text-black'}`}>Semua</button>
                  <button onClick={() => setReturnFilter('late')} className={`px-4 py-1 rounded-full text-sm ${returnFilter === 'late' ? 'bg-red-500 text-white' : 'bg-gray-200 text-black'}`}>Terlambat</button>
                  <button onClick={() => setReturnFilter('ontime')} className={`px-4 py-1 rounded-full text-sm ${returnFilter === 'ontime' ? 'bg-green-500 text-white' : 'bg-gray-200 text-black'}`}>Tepat Waktu</button>
                </div>
              )}
            </div>
            
            {activeTab === "buku" && (
                <div>
                  <h1 className="text-2xl font-semibold text-gray-800 mb-4">List Buku</h1>
                   <ul className="space-y-3">
                     {pagedData.map((book) => (
                       <li key={book.id} className="flex items-center justify-between px-4 py-3 rounded-md bg-gray-50 shadow-sm">
                         <span className="text-gray-900">{book.id}. {book.title}</span>
                         <Link href={`/admin/${book.id}/detailbuku`}>
                            <button className="px-3 py-1 bg-[#678D7D] text-white rounded-full hover:bg-[#5a776d] transition">Detail</button>
                         </Link>
                       </li>
                     ))}
                   </ul>
                </div>
            )}
            
            {activeTab === "peminjaman" && (
              <div className="overflow-x-auto">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">List Peminjaman</h1>
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300">
                        {/* PERUBAHAN DI SINI: Kolom "ID Pinjam" dihilangkan dari header */}
                        {['Judul Buku', 'Nama', 'NRP', 'Tgl Pinjam', 'Tgl Kembali', 'Aksi'].map(h => <th key={h} className="px-4 py-2 text-left text-gray-800 font-semibold">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {pagedData.map((p: Loan) => (
                      <tr key={p.id} className="bg-white border-b">
                        {/* PERUBAHAN DI SINI: Kolom "ID Pinjam" tidak dirender, tapi kolom tanggal ditambahkan */}
                        <td className="px-4 py-2 text-gray-900">{p.title}</td>
                        <td className="px-4 py-2 text-gray-900">{p.name}</td>
                        <td className="px-4 py-2 text-gray-900">{p.nrp}</td>
                        <td className="px-4 py-2 text-gray-900">{p.tglPinjam}</td>
                        <td className="px-4 py-2 text-gray-900">{p.tglKembali}</td>
                        <td className="px-4 py-2">
                          <button onClick={() => openReturnModal(p)} className="px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition text-sm">
                            Kembalikan
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "pengembalian" && (
              <div className="overflow-x-auto">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">List Pengembalian</h1>
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                      <tr className="border-b border-gray-300">
                        {['Judul Buku', 'Nama', 'NRP', 'Tgl Kembali', 'Tgl Dikembalikan', 'Status'].map(h => <th key={h} className="px-4 py-2 text-left text-gray-800 font-semibold">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {pagedData.map((p: Return) => (
                        <tr key={p.id} className="bg-white border-b">
                          <td className="px-4 py-2 text-gray-900">{p.title}</td>
                          <td className="px-4 py-2 text-gray-900">{p.name}</td>
                          <td className="px-4 py-2 text-gray-900">{p.nrp}</td>
                          <td className="px-4 py-2 text-gray-900">{p.tglKembali}</td>
                          <td className="px-4 py-2 text-gray-900">{p.tglDikembalikan}</td>
                          <td className="px-4 py-2">
                             <span className={`px-3 py-1 rounded-full text-xs font-semibold ${p.isLate ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                                {p.isLate ? "Terlambat" : "Tepat Waktu"}
                             </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                </table>
              </div>
            )}
            
            <div className="mt-6 flex justify-between items-center">
                <div className="flex items-center space-x-3 text-black">
                    <label htmlFor="itemsPerPage" className="text-sm font-medium">Data per halaman:</label>
                    <select id="itemsPerPage" className="border border-gray-300 rounded px-2 py-1 text-black" value={itemsPerPage} onChange={(e) => { setItemsPerPage(parseInt(e.target.value)); setCurrentPage(1); }}>
                      {[3, 5, 10].map((num) => (<option key={num} value={num}>{num}</option>))}
                    </select>
                </div>
                <div className="flex justify-end space-x-2">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-3 py-1 rounded border border-black text-black hover:bg-black hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed">Prev</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1 rounded border ${currentPage === page ? "bg-black text-white" : "border-black text-black hover:bg-black hover:text-white"} transition`}>{page}</button>
                    ))}
                    <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(currentPage + 1)} className="px-3 py-1 rounded border border-black text-black hover:bg-black hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
                </div>
            </div>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {isScannerOpen && (
          <motion.div
            className="fixed inset-0 bg-transparent bg-opacity-70 flex flex-col items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white p-4 rounded-lg shadow-xl w-11/12 max-w-md">
              <div id="qr-reader" className="w-full"></div>
            </div>
            <p className="text-black mt-4">Arahkan kamera ke QR Code peminjaman</p>
            <button
              onClick={() => setIsScannerOpen(false)}
              className="mt-4 px-6 py-2 bg-white text-black rounded-lg"
            >
              Batal
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReturnModal && selectedLoan && (
          <motion.div
            className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowReturnModal(false)}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4 text-gray-900">Konfirmasi Pengembalian Buku</h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>Judul Buku:</strong> {selectedLoan.title}</p>
                <p><strong>ID Buku:</strong> {selectedLoan.bookId}</p>
                <p><strong>Nama Peminjam:</strong> {selectedLoan.name}</p>
                <p><strong>NRP:</strong> {selectedLoan.nrp}</p>
                <p><strong>Tanggal Pinjam:</strong> {selectedLoan.tglPinjam}</p>
                <p><strong>Tanggal Harus Kembali:</strong> {selectedLoan.tglKembali}</p>
              </div>
              <div className="mt-6 border-t pt-4">
                <label className="block text-sm font-medium text-gray-800 mb-2">
                    Apakah Anda yakin ingin menyelesaikan peminjaman ini?
                </label>
                <p className="text-xs text-gray-500 mb-4">
                  Tindakan ini akan memindahkan data dari list Peminjaman ke Pengembalian.
                </p>
                <div className="flex justify-end space-x-3">
                  <button onClick={() => setShowReturnModal(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-black hover:bg-gray-100">
                    Batal
                  </button>
                  <button onClick={handleReturnBook} className="px-4 py-2 bg-[#678D7D] text-white rounded-lg hover:bg-[#5a776d]">
                    Ya, Kembalikan Buku
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}