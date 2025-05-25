// app/page.tsx
"use client";

import React, { useState } from "react";
import Header from "../components/Header";
import Image from "next/image";

const FILTERS = ["Kategori", "Pengarang", "Tahun Terbit", "ID Buku"];
const OPTIONS = {
  Kategori: ["Novel", "Komik", "Ensiklopedia", "Nomik", "Antologi", "Dongeng", "Karya Ilmiah"],
  Pengarang: [
    "Dr. Ir. Kartini, Mp",
    "Dr. dr. Zairin Noor SpOT(K)., MM., FICS.",
    "Prof. Dr.Ir Achamu Ir.Muharlien. MP",
    "Francine Jay",
    "Pidi Baiq",
    "Tere Liye",
    "Tsana",
  ],
  "Tahun Terbit": Array.from({ length: 7 }, (_, i) => String(1999 + i)),
  "ID Buku": [
    "978-979-1227-39-4",
    "978-602-291-251-4",
    "978-602-424-694-6",
    "978-602-03-3147-2",
    "978-602-8997-89-9",
    "820.3 PRA I",
    "899.221 3 AND I",
  ],
};

const RECOMMENDATIONS = [
  { title: "Seni Hidup Minimalis", author: "Francine Jay" },
  { title: "Dia adalah Dilan Tahun 1990", author: "Pidi Baiq" },
  { title: "Filosofi Teras", author: "Henry Menampiring" },
  { title: "Selamat Tinggal", author: "Tere Liye" },
];

export default function HomePage(): JSX.Element {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const options = activeFilter ? OPTIONS[activeFilter as keyof typeof OPTIONS] : [];
  const placeholder = activeFilter ? `Cari Berdasarkan ${activeFilter}...` : "";

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Panggil Header dari komponen terpisah */}
      <Header />

      {/* Filters Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-6 bg-white shadow mb-8">
        <div className="flex flex-wrap sm:flex-nowrap justify-start sm:justify-between gap-4 sm:gap-6">
          {FILTERS.map((f) => {
            const isIDBuku = f === "ID Buku";
            return (
              <div key={f} className="relative flex-shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => setActiveFilter(activeFilter === f ? null : f)}
                  className={`w-full sm:w-auto py-2 px-4 sm:px-6 rounded-full border whitespace-nowrap transition text-sm sm:text-base ${
                    activeFilter === f
                      ? "bg-green-400 text-white border-transparent"
                      : "border-gray-700 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {f}
                </button>

                {activeFilter === f && (
                  <div
                    className={`absolute z-50 top-full mt-2 w-screen max-w-xs sm:max-w-sm bg-white rounded-lg shadow-lg border border-gray-200 overflow-auto p-4 max-h-60 sm:max-h-96 ${
                      isIDBuku
                        ? "right-0 sm:right-0 sm:left-auto left-1/2 -translate-x-1/2 sm:translate-x-0"
                        : "left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0"
                    }`}
                  >
                    <input
                      type="text"
                      placeholder={placeholder}
                      className="w-full mb-4 rounded-full bg-gray-200 text-gray-700 placeholder-gray-500 pl-4 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
                    />
                    <ul className="space-y-2 text-sm">
                      {options.map((opt) => (
                        <li key={opt} className="flex items-center">
                          <input type="checkbox" id={opt} className="mr-2 w-4 h-4 text-green-500" />
                          <label htmlFor={opt} className="text-gray-800 truncate">
                            {opt}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Recommendations Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Rekomendasi</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {RECOMMENDATIONS.map(({ title, author }) => (
            <div key={title} className="flex flex-col items-center">
              <div className="w-full pb-[100%] bg-gray-200 rounded-xl border border-gray-300 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-500">Insert image</span>
                </div>
              </div>
              <p className="mt-3 text-center text-sm font-medium text-gray-800 line-clamp-1">{title}</p>
              <p className="text-center text-xs text-gray-600">{author}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <button className="px-8 py-2 bg-blue-800 text-white rounded-full hover:bg-blue-900 transition">
            Selengkapnya
          </button>
        </div>
      </section>
    </div>
  );
}
