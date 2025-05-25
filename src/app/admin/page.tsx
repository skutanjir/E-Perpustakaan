"use client";

import React, { useState } from "react";
import Header from "../components/HeaderAdmin";
import Sidebar from "../components/sidebar";
import Link from "next/link";

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
  isLate: boolean;
}

const books: Book[] = [
  { id: 1, title: "Seni Memahami Hidup Minimalis" },
  { id: 2, title: "Dia adalah Dilanku Tahun 1990" },
  { id: 3, title: "Filosofi Teras" },
  { id: 4, title: "Selamat Tinggal" },
  { id: 5, title: "Timun Jelita" },
  { id: 6, title: "Tanah Para Bandit" },
  { id: 7, title: "Atmosphere" },
];

const peminjamans: Loan[] = [
  {
    id: 1,
    title: "Kata",
    bookId: "9786020646200",
    name: "Nasya",
    nrp: "3124500000",
    tglPinjam: "24/10/2024",
    tglKembali: "27/10/2024",
  },
  {
    id: 2,
    title: "Dilan",
    bookId: "9786027870813",
    name: "Kiara",
    nrp: "3124600000",
    tglPinjam: "02/10/2024",
    tglKembali: "05/10/2024",
  },
];

const pengembalians: Return[] = [
  {
    id: 1,
    title: "Kata",
    bookId: "9786020646200",
    name: "Nasya",
    nrp: "3124500000",
    tglPinjam: "24/10/2024",
    tglKembali: "30/10/2024",
    isLate: true,
  },
  {
    id: 2,
    title: "Dilan",
    bookId: "9786027870813",
    name: "Kiara",
    nrp: "3124600000",
    tglPinjam: "02/10/2024",
    tglKembali: "05/10/2024",
    isLate: false,
  },
];

export default function Page() {
  const [activeTab, setActiveTab] = useState<"buku" | "peminjaman" | "pengembalian">("buku");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  const lateReturns = pengembalians.filter((r) => r.isLate).length;

  // Tentukan data dan totalPages sesuai tab aktif
  let data: any[] = [];
  if (activeTab === "buku") data = books;
  else if (activeTab === "peminjaman") data = peminjamans;
  else if (activeTab === "pengembalian") data = pengembalians;

  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Potong data sesuai halaman sekarang
  const pagedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 bg-gray-50">
        <Header />
        <main className="px-8 py-6">
          {/* Cards atas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Jumlah Buku", value: books.length },
              { label: "Sedang Dipinjam", value: peminjamans.length },
              { label: "Rata-rata Traffic/Bulan", value: 15 },
              { label: "Buku Telat", value: lateReturns, greenBg: true },
            ].map(({ label, value, greenBg }, i) => (
              <div
                key={i}
                className={`relative bg-white rounded-2xl shadow-md p-4 border ${
                  greenBg ? "border-red-400" : "border-gray-300"
                }`}
              >
                <h3 className="text-sm text-gray-500">{label}</h3>
                <p className={`text-2xl font-bold ${greenBg ? "text-red-700" : "text-gray-800"}`}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Tab menu */}
          <nav className="flex gap-4 mb-8">
            {["buku", "peminjaman", "pengembalian"].map((tab) => {
              const label = tab === "buku" ? "Buku" : tab === "peminjaman" ? "Peminjaman" : "Pengembalian";
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setCurrentPage(1); // reset page saat ganti tab
                  }}
                  className={`px-6 py-2 rounded-full font-medium transition ${
                    isActive ? "bg-[#678D7D] text-white" : "border border-[#678D7D] text-[#678D7D]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </nav>

          {/* Konten tab */}
          {activeTab === "buku" && (
            <div className="bg-white border border-gray-300 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold text-gray-800">List Buku</h1>
                <div className="flex items-center space-x-3 text-black">
                  <label htmlFor="itemsPerPage" className="text-sm font-medium">
                    Data per halaman:
                  </label>
                  <select
                    id="itemsPerPage"
                    className="border border-gray-300 rounded px-2 py-1 text-black"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(parseInt(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    {[3, 5, 10].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <ul className="space-y-3">
                {pagedData.map((book) => (
                  <li
                    key={book.id}
                    className="flex items-center justify-between px-4 py-3 rounded-md bg-gray-50 shadow-sm"
                  >
                    <span className="text-gray-900">
                      {book.id}. {book.title}
                    </span>
                    <Link href={`/admin/buku/${book.id}`}>
                      <button className="px-3 py-1 bg-[#678D7D] text-white rounded-full hover:bg-[#5a776d] transition">
                        Detail
                      </button>
                    </Link>
                  </li>
                ))}
              </ul>
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
            </div>
          )}

          {activeTab === "peminjaman" && (
            <div className="bg-white border border-gray-300 rounded-2xl p-4 shadow-sm overflow-x-auto">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold text-gray-800">List Peminjaman</h1>
                <div className="flex items-center space-x-3 text-black">
                  <label htmlFor="itemsPerPagePinjam" className="text-sm font-medium">
                    Data per halaman:
                  </label>
                  <select
                    id="itemsPerPagePinjam"
                    className="border border-gray-300 rounded px-2 py-1 text-black"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(parseInt(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    {[3, 5, 10].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="px-4 py-2 text-left text-gray-800 font-semibold">Judul Buku</th>
                    <th className="px-4 py-2 text-left text-gray-800 font-semibold">ID Buku</th>
                    <th className="px-4 py-2 text-left text-gray-800 font-semibold">Nama</th>
                    <th className="px-4 py-2 text-left text-gray-800 font-semibold">NRP</th>
                    <th className="px-4 py-2 text-left text-gray-800 font-semibold">Tanggal Pinjam</th>
                    <th className="px-4 py-2 text-left text-gray-800 font-semibold">Tanggal Kembali</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedData.map((p) => (
                    <tr key={p.id} className="bg-white">
                      <td className="px-4 py-2 text-gray-900">{p.title}</td>
                      <td className="px-4 py-2 text-gray-900">{p.bookId}</td>
                      <td className="px-4 py-2 text-gray-900">{p.name}</td>
                      <td className="px-4 py-2 text-gray-900">{p.nrp}</td>
                      <td className="px-4 py-2 text-gray-900">{p.tglPinjam}</td>
                      <td className="px-4 py-2 text-gray-900">{p.tglKembali}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
            </div>
          )}

          {activeTab === "pengembalian" && (
            <div className="bg-white border border-gray-300 rounded-2xl p-4 shadow-sm overflow-x-auto">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold text-gray-800">List Pengembalian</h1>
                <div className="flex items-center space-x-3 text-black">
                  <label htmlFor="itemsPerPageKembali" className="text-sm font-medium">
                    Data per halaman:
                  </label>
                  <select
                    id="itemsPerPageKembali"
                    className="border border-gray-300 rounded px-2 py-1 text-black"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(parseInt(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    {[3, 5, 10].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="px-4 py-2 text-left text-gray-800 font-semibold">Judul Buku</th>
                    <th className="px-4 py-2 text-left text-gray-800 font-semibold">ID Buku</th>
                    <th className="px-4 py-2 text-left text-gray-800 font-semibold">Nama</th>
                    <th className="px-4 py-2 text-left text-gray-800 font-semibold">NRP</th>
                    <th className="px-4 py-2 text-left text-gray-800 font-semibold">Tanggal Pinjam</th>
                    <th className="px-4 py-2 text-left text-gray-800 font-semibold">Tanggal Kembali</th>
                    <th className="px-4 py-2 text-left text-gray-800 font-semibold">Terlambat</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedData.map((p) => (
                    <tr key={p.id} className="bg-white">
                      <td className="px-4 py-2 text-gray-900">{p.title}</td>
                      <td className="px-4 py-2 text-gray-900">{p.bookId}</td>
                      <td className="px-4 py-2 text-gray-900">{p.name}</td>
                      <td className="px-4 py-2 text-gray-900">{p.nrp}</td>
                      <td className="px-4 py-2 text-gray-900">{p.tglPinjam}</td>
                      <td className="px-4 py-2 text-gray-900">{p.tglKembali}</td>
                      <td className={`px-4 py-2 font-semibold ${p.isLate ? "text-red-700" : "text-green-700"}`}>
                        {p.isLate ? "Ya" : "Tidak"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
