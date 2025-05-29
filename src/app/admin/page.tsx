"use client";

import React, { JSX, useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/HeaderAdmin";
import Sidebar from "@/components/sidebar";
import Link from "next/link";
import { Html5Qrcode } from "html5-qrcode";
import { FiCamera } from "react-icons/fi";
import { get, apiRequest, ApiErrorResponse } from "@/lib/api/apiService";
import type { Book } from "@/types";

interface AdminBook extends Book {}

interface BorrowingRecord {
  id: string | number;
  book: { isbn: string; title: string };
  user: { id: string; name: string; nrp: string };
  borrowDate: string;
  returnDate: string;
  returnedDate?: string | null;
  isLate?: boolean;
}

interface LibraryStats {
  booksTotal: number;
  borrowedTotal: number;
  averageBorrowedBooksPerMonth: number;
  notReturnedCount: number;
}

interface PaginatedBooksResponse {
  data: AdminBook[];
  pagination: {
    totalPages: number;
    currentPage: number;
  };
}

type ActiveTab = "buku" | "peminjaman" | "pengembalian";

// Definisikan tipe untuk state notifikasi
interface NotificationState {
  show: boolean;
  type: "success" | "info" | "error";
  message: string;
}

export default function AdminDashboardPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState<ActiveTab>("buku");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [booksData, setBooksData] = useState<AdminBook[]>([]);
  const [allBorrowingRecords, setAllBorrowingRecords] = useState<BorrowingRecord[]>([]);

  const [totalPages, setTotalPages] = useState(0);
  const [loadingTabData, setLoadingTabData] = useState(true);
  const [tabError, setTabError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [returnFilter, setReturnFilter] = useState<"all" | "late" | "ontime">("all");

  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<BorrowingRecord | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const [libraryStats, setLibraryStats] = useState<LibraryStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: "info",
    message: "",
  });

  const fetchLibraryStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const response = await get<{ data: LibraryStats }>("/borrowings/library/stats");
      setLibraryStats(response.data);
    } catch (error: any) {
      const apiErr = error as ApiErrorResponse;
      setStatsError(apiErr.error || apiErr.message || "Gagal memuat statistik.");
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLibraryStats();
  }, [fetchLibraryStats]);

  const fetchDataForTab = useCallback(async (tab: ActiveTab, page: number, limit: number, search: string) => {
    setLoadingTabData(true);
    setTabError(null);
    try {
      if (tab === "buku") {
        const params = { page: String(page), pageSize: String(limit), ...(search && { title: search }) };
        const response = await get<PaginatedBooksResponse>("/books/search", { params });
        setBooksData(response.data);
        setTotalPages(response.pagination.totalPages);
        setCurrentPage(response.pagination.currentPage > 0 ? response.pagination.currentPage : 1);
      } else if (tab === "peminjaman" || tab === "pengembalian") {
        const response = await get<{ data: BorrowingRecord[] }>("/borrowings");
        setAllBorrowingRecords(response.data);
      }
    } catch (err: any) {
      const apiErr = err as ApiErrorResponse;
      setTabError(apiErr.error || apiErr.message || `Gagal memuat data ${tab}.`);
      setBooksData([]);
      setAllBorrowingRecords([]);
      setTotalPages(0);
    } finally {
      setLoadingTabData(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "buku") {
      fetchDataForTab("buku", currentPage, itemsPerPage, searchTerm);
    }
  }, [activeTab, currentPage, itemsPerPage, searchTerm, fetchDataForTab]);

  useEffect(() => {
    if ((activeTab === "peminjaman" || activeTab === "pengembalian") && allBorrowingRecords.length === 0 && !loadingTabData) {
      fetchDataForTab(activeTab, 1, 0, "");
    }
  }, [activeTab, allBorrowingRecords.length, loadingTabData, fetchDataForTab]);

  const processedClientSideData = useMemo(() => {
    if (activeTab === 'buku') {
      return booksData;
    }
    let filteredRecords: BorrowingRecord[] = [];
    if (activeTab === 'peminjaman') {
      filteredRecords = allBorrowingRecords.filter(record => record.returnedDate === null || record.returnedDate === undefined || record.returnedDate === "");
    } else if (activeTab === 'pengembalian') {
      filteredRecords = allBorrowingRecords.filter(record => record.returnedDate && record.returnedDate !== "")
        .map(record => ({
          ...record,
          isLate: record.returnedDate && new Date(record.returnedDate) > new Date(record.returnDate)
        }));
      if (returnFilter === 'late') {
        filteredRecords = filteredRecords.filter(p => p.isLate);
      } else if (returnFilter === 'ontime') {
        filteredRecords = filteredRecords.filter(p => !p.isLate);
      }
    }
    if (searchTerm) {
      return filteredRecords.filter(p =>
        (p.book?.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (p.user?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (p.user?.nrp || "").includes(searchTerm.toLowerCase())
      );
    }
    return filteredRecords;
  }, [activeTab, searchTerm, returnFilter, allBorrowingRecords, booksData]);

  useEffect(() => {
    if (activeTab === "peminjaman" || activeTab === "pengembalian") {
      const newTotalPages = Math.ceil(processedClientSideData.length / itemsPerPage);
      setTotalPages(newTotalPages > 0 ? newTotalPages : 1);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      } else if (currentPage === 0 && newTotalPages > 0) {
         setCurrentPage(1);
      } else if (newTotalPages === 0) {
        setCurrentPage(1);
      }
    }
  }, [activeTab, processedClientSideData, itemsPerPage, currentPage]);

  const pagedData = useMemo(() => {
    if (activeTab === 'buku') {
      return booksData;
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedClientSideData.slice(startIndex, startIndex + itemsPerPage);
  }, [activeTab, booksData, processedClientSideData, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, returnFilter]);

  const openReturnModal = useCallback((loan: BorrowingRecord) => {
    setSelectedLoan(loan);
    setShowReturnModal(true);
  }, []);

  const handleReturnBook = async () => {
    if (!selectedLoan) return;
    setLoadingTabData(true);
    try {
      await apiRequest('patch', `/borrowings/${selectedLoan.id}`, {});
      setShowReturnModal(false);
      setSelectedLoan(null);
      setNotification({
        show: true,
        type: 'success',
        message: 'Buku berhasil dikembalikan!'
      });
      await fetchLibraryStats();
      const currentData = await get<{ data: BorrowingRecord[] }>("/borrowings");
      setAllBorrowingRecords(currentData.data);
    } catch (error: any) {
      const apiError = error as ApiErrorResponse;
      setShowReturnModal(false);
      setSelectedLoan(null);
      setNotification({
        show: true,
        type: 'error',
        message: `Gagal mengembalikan buku: ${apiError.error || apiError.message || "Error tidak diketahui"}`
      });
    } finally {
      setLoadingTabData(false);
    }
  };

  useEffect(() => {
    if (!isScannerOpen) return;
    const qrCodeRegionId = "qr-reader";
    let html5QrCodeInstance: Html5Qrcode | null = null;
    const readerElement = document.getElementById(qrCodeRegionId);

    if (!readerElement) {
      setIsScannerOpen(false);
      return;
    }
    html5QrCodeInstance = new Html5Qrcode(qrCodeRegionId);

    const onScanSuccess = (decodedText: string) => {
      const scannedId = decodedText.trim();
      setIsScannerOpen(false); // Tutup scanner setelah scan

      const loanToReturn = allBorrowingRecords.find(record => {
        const recordIdAsString = String(record.id).trim();
        const isActiveLoan = record.returnedDate === null || record.returnedDate === undefined || record.returnedDate === "";
        const idMatches = recordIdAsString === scannedId;
        return isActiveLoan && idMatches;
      });

      if (loanToReturn) {
        openReturnModal(loanToReturn);
      } else {
        const anyLoanWithId = allBorrowingRecords.find(record => String(record.id).trim() === scannedId);
        if (anyLoanWithId) {
          setNotification({
            show: true,
            type: "info",
            message: `Buku dengan ID Peminjaman "${scannedId}" sudah dikembalikan atau statusnya tidak aktif.`
          });
        } else {
          setNotification({
            show: true,
            type: "info",
            message: `Peminjaman dengan ID "${scannedId}" tidak ditemukan.`
          });
        }
      }
    };

    const config = { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 };
    if (html5QrCodeInstance) {
      html5QrCodeInstance.start({ facingMode: "environment" }, config, onScanSuccess, (errorMessage) => {})
        .catch(err => {
          alert("Gagal memulai kamera. Pastikan izin kamera sudah diberikan dan tidak ada aplikasi lain yang menggunakan kamera.");
          setIsScannerOpen(false);
        });
    }

    return () => {
      if (html5QrCodeInstance && html5QrCodeInstance.isScanning) {
        html5QrCodeInstance.stop().catch(err => {});
      }
    };
  }, [isScannerOpen, allBorrowingRecords, openReturnModal]);

  const statsCards = [
    { label: "Jumlah Buku", value: statsLoading ? "..." : libraryStats?.booksTotal ?? "N/A" },
    { label: "Sedang Dipinjam", value: statsLoading ? "..." : libraryStats?.borrowedTotal ?? "N/A" },
    { label: "Rata-rata Traffic/Bulan", value: statsLoading ? "..." : libraryStats?.averageBorrowedBooksPerMonth ?? "N/A" },
    { label: "Buku Telat", value: statsLoading ? "..." : libraryStats?.notReturnedCount ?? "N/A", isHighlight: true },
  ];

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <Header />
        <main className="px-4 sm:px-6 md:px-8 py-6">
          {/* ... (JSX untuk statistik, navigasi tab, filter, tabel data, paginasi tetap sama) ... */}
          {statsError && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{statsError}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statsCards.map(({ label, value, isHighlight }, i) => (
              <div key={i} className={`relative bg-white rounded-xl shadow-lg p-4 sm:p-5 border ${ isHighlight ? "border-red-500 shadow-red-200" : "border-gray-200" }`}>
                <h3 className="text-xs sm:text-sm text-gray-500 mb-1 truncate">{label}</h3>
                <p className={`text-xl sm:text-2xl font-bold ${isHighlight ? "text-red-600" : "text-gray-800"}`}>{value}</p>
              </div>
            ))}
          </div>

          <nav className="flex flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8">
            {(["buku", "peminjaman", "pengembalian"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab);}}
                className={`px-4 py-2 sm:px-5 rounded-full font-medium transition text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                  activeTab === tab ? "bg-[#678D7D] text-white shadow-md focus:ring-[#527064]" : "border border-[#678D7D] text-[#678D7D] hover:bg-[#eaf0ee] focus:ring-[#a5c2b9]"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
            
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex flex-col md:flex-row items-center justify-between mb-5 gap-3 md:gap-4">
              <div className="flex w-full md:max-w-md items-center gap-2">
                <input
                  type="text"
                  placeholder={activeTab === "buku" ? "Cari berdasarkan judul buku..." : `Cari berdasarkan judul, nama, atau NRP...`}
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value);}}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#678D7D] focus:border-transparent"
                />
                {activeTab === 'peminjaman' && (
                  <button
                    onClick={() => setIsScannerOpen(true)}
                    title="Scan QR Code Buku"
                    className="flex-shrink-0 flex items-center gap-2 px-3 py-2.5 bg-[#678D7D] text-white rounded-lg hover:bg-[#5a776d] transition focus:outline-none focus:ring-2 focus:ring-[#527064]"
                  >
                    <FiCamera size={18}/>
                    <span className="hidden sm:inline text-sm">Scan</span>
                  </button>
                )}
              </div>
              
              {activeTab === 'pengembalian' && (
                <div className="flex gap-2 flex-wrap justify-start md:justify-end w-full md:w-auto mt-3 md:mt-0">
                  <button onClick={() => {setReturnFilter('all');}} className={`px-3 py-1.5 rounded-full text-xs sm:text-sm ${returnFilter === 'all' ? 'bg-[#678D7D] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Semua</button>
                  <button onClick={() => {setReturnFilter('late');}} className={`px-3 py-1.5 rounded-full text-xs sm:text-sm ${returnFilter === 'late' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Terlambat</button>
                  <button onClick={() => {setReturnFilter('ontime');}} className={`px-3 py-1.5 rounded-full text-xs sm:text-sm ${returnFilter === 'ontime' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Tepat Waktu</button>
                </div>
              )}
            </div>
            
           {loadingTabData && <div className="text-center text-gray-500 py-10">Memuat data...</div>}
           {tabError && <div className="text-center text-red-500 py-10 bg-red-50 rounded-md">{tabError}</div>}

           {!loadingTabData && !tabError && pagedData.length === 0 && (
             <div className="text-center text-gray-500 py-10">Tidak ada data untuk ditampilkan.</div>
           )}

            {!loadingTabData && !tabError && pagedData.length > 0 && (
              <>
                {activeTab === "buku" && (
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">List Buku</h2>
                      <ul className="space-y-2.5">
                        {pagedData.map((book: any) => ( 
                          <li key={(book as AdminBook).isbn} className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-3 rounded-lg bg-gray-50 shadow hover:shadow-md transition-shadow">
                            <span className="text-gray-800 text-sm mb-2 sm:mb-0 sm:text-base flex-grow">{(book as AdminBook).title} (ISBN: {(book as AdminBook).isbn})</span>
                            <Link href={`/admin/books/${(book as AdminBook).isbn}/detail`}> 
                              <button className="px-4 py-1.5 bg-[#5a776d] text-white rounded-full hover:bg-[#49625a] transition text-xs sm:text-sm w-full sm:w-auto">Detail</button>
                            </Link>
                          </li>
                        ))}
                      </ul>
                  </div>
                )}
                
                {activeTab === "peminjaman" && (
                  <div className="overflow-x-auto">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">List Peminjaman Aktif</h2>
                    <table className="min-w-full w-full table-auto border-collapse">
                      <thead className="bg-gray-100">
                        <tr>
                          {['ID', 'Judul Buku', 'Peminjam', 'NRP', 'Pinjam', 'Kembali', 'Aksi'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{h}</th>)}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {pagedData.map((p: any) => ( 
                          <tr key={(p as BorrowingRecord).id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{(p as BorrowingRecord).id}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{(p as BorrowingRecord).book.title}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{(p as BorrowingRecord).user.name}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{(p as BorrowingRecord).user.nrp}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{new Date((p as BorrowingRecord).borrowDate).toLocaleDateString('id-ID')}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{new Date((p as BorrowingRecord).returnDate).toLocaleDateString('id-ID')}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <button onClick={() => openReturnModal(p as BorrowingRecord)} className="px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition text-xs">
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
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">List Pengembalian</h2>
                    <table className="min-w-full w-full table-auto border-collapse">
                        <thead className="bg-gray-100">
                          <tr>
                            {['ID', 'Judul Buku', 'Peminjam', 'NRP', 'Jatuh Tempo', 'Dikembalikan', 'Status'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{h}</th>)}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {pagedData.map((p: any) => ( 
                            <tr key={(p as BorrowingRecord).id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{(p as BorrowingRecord).id}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{(p as BorrowingRecord).book.title}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{(p as BorrowingRecord).user.name}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{(p as BorrowingRecord).user.nrp}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{new Date((p as BorrowingRecord).returnDate).toLocaleDateString('id-ID')}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{(p as BorrowingRecord).returnedDate ? new Date((p as BorrowingRecord).returnedDate!).toLocaleDateString('id-ID') : '-'}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">
                                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${ (p as BorrowingRecord).isLate ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                                    { (p as BorrowingRecord).isLate ? "Terlambat" : "Tepat Waktu"}
                                  </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
            
            {!loadingTabData && !tabError && totalPages > 0 && pagedData.length > 0 && (
              <div className="mt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-2">
                      <label htmlFor="itemsPerPage" className="text-sm font-medium text-gray-700">Data per halaman:</label>
                      <select 
                          id="itemsPerPage" 
                          className="border border-gray-300 rounded-md px-2 py-1.5 text-gray-700 focus:ring-1 focus:ring-[#678D7D] focus:border-[#678D7D] text-sm"
                          value={itemsPerPage} 
                          onChange={(e) => { setItemsPerPage(parseInt(e.target.value));}}
                      >
                        {[5, 10, 15, 20].map((num) => (<option key={num} value={num}>{num}</option>))}
                      </select>
                  </div>
                  <div className="flex items-center space-x-1">
                      <button 
                          disabled={currentPage === 1} 
                          onClick={() => setCurrentPage(c => Math.max(1, c - 1))} 
                          className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      > Prev </button>
                      <span className="px-2 py-1.5 text-sm text-gray-700">
                          Hal {currentPage} dari {totalPages}
                      </span>
                      <button 
                          disabled={currentPage === totalPages || totalPages === 0} 
                          onClick={() => setCurrentPage(c => Math.min(totalPages, c + 1))} 
                          className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      > Next </button>
                  </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <AnimatePresence>
        {isScannerOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center z-[100] p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md">
              <div id="qr-reader" className="w-full aspect-[1/1] bg-gray-100 rounded-lg overflow-hidden border border-gray-300"></div>
            </div>
            <p className="text-white mt-5 text-center text-sm sm:text-base">Arahkan kamera ke QR Code</p>
            <button
              onClick={() => setIsScannerOpen(false)}
              className="mt-5 px-8 py-2.5 bg-white text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition"
            > Batal </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showReturnModal && selectedLoan && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-lg lg:text-xl font-bold mb-4 text-gray-800">Konfirmasi Pengembalian</h3>
              <div className="space-y-1.5 text-sm text-gray-600">
                <p><strong>Judul:</strong> {selectedLoan.book.title}</p>
                <p><strong>ISBN:</strong> {selectedLoan.book.isbn}</p>
                <p><strong>Peminjam:</strong> {selectedLoan.user.name} ({selectedLoan.user.nrp})</p>
                <p><strong>Dipinjam:</strong> {new Date(selectedLoan.borrowDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric'})}</p>
                <p><strong>Harus Kembali:</strong> {new Date(selectedLoan.returnDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric'})}</p>
              </div>
              <div className="mt-6 border-t border-gray-200 pt-5">
                <p className="text-sm text-gray-500 mb-4">
                  Pastikan buku sudah diterima sebelum melanjutkan.
                </p>
                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <button 
                    onClick={() => { setShowReturnModal(false); setSelectedLoan(null); }} 
                    className="px-5 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition w-full sm:w-auto text-sm font-medium"
                  > Batal </button>
                  <button 
                    onClick={handleReturnBook} 
                    disabled={loadingTabData}
                    className="px-5 py-2 bg-[#678D7D] text-white rounded-lg hover:bg-[#5a776d] transition w-full sm:w-auto text-sm font-medium disabled:opacity-70"
                  > {loadingTabData ? "Memproses..." : "Ya, Kembalikan"} </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Notifikasi General (Sukses, Info, Error) */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-[150] p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {notification.type === 'success' && (
                <motion.div
                  key="success-icon"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 15 }}
                  className="mx-auto mb-5 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 flex items-center justify-center"
                >
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-green-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                  </svg>
                </motion.div>
              )}
              {notification.type === 'info' && (
                <motion.div
                  key="info-icon"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
                  className="mx-auto mb-5 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-100 flex items-center justify-center"
                >
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </motion.div>
              )}
              {notification.type === 'error' && (
                <motion.div
                  key="error-icon"
                  initial={{ scale: 0, y: -20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 15 }}
                  className="mx-auto mb-5 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-100 flex items-center justify-center"
                >
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </motion.div>
              )}
              <p className="text-base sm:text-lg font-medium text-gray-800 mb-6 px-2">{notification.message}</p>
              <button
                onClick={() => setNotification(prev => ({ ...prev, show: false }))}
                className="w-full sm:w-auto px-8 py-2.5 bg-[#678D7D] text-white rounded-lg hover:bg-[#5a776d] focus:outline-none focus:ring-2 focus:ring-[#527064] focus:ring-offset-2 transition text-sm sm:text-base font-medium"
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}