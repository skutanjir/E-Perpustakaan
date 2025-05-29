"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef, JSX } from "react";
import Header from "@/components/Header";
import Image from "next/image";
import { get } from "@/lib/api/apiService";
import type { ApiErrorResponse } from "@/lib/api/apiService";
import type { Book } from "@/types"; // Pastikan tipe Book ini sudah Anda definisikan

interface PaginatedResponse {
  data: Book[];
  pagination: {
    totalPages: number;
    currentPage: number;
  };
}

const FILTERS = ["Kategori", "Pengarang", "Tahun Terbit"];

const generatePaginationRange = (
  currentPage: number,
  totalPages: number,
  siblingCount: number = 1
): (number | string)[] => {
  const totalPageNumbers = siblingCount + 5;
  if (totalPageNumbers >= totalPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(
    currentPage + siblingCount,
    totalPages
  );
  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 2;
  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    let leftItemCount = 3 + 2 * siblingCount;
    let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, "...", totalPages];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    let rightItemCount = 3 + 2 * siblingCount;
    let rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + 1 + i
    );
    return [firstPageIndex, "...", ...rightRange];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    let middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    );
    return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
  }
  return []; 
};

export default function HomePage(): JSX.Element {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({
    Kategori: [],
    Pengarang: [],
    "Tahun Terbit": [],
  });
  const [filterSearchTerms, setFilterSearchTerms] = useState<
    Record<string, string>
  >({
    Kategori: "",
    Pengarang: "",
    "Tahun Terbit": "",
  });

  const [dynamicOptions, setDynamicOptions] = useState<
    Record<string, string[]>
  >({
    Kategori: [],
    Pengarang: [],
    "Tahun Terbit": [],
  });

  const isInitialMount = useRef(true);

  const fetchBooksByPage = async (
    page: number,
    filters: Record<string, string[]>
  ) => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({
      page: String(page),
      pageSize: "8",
    });

    if (filters.Kategori.length > 0) {
      params.append("categoryName", filters.Kategori.join(","));
    }
    if (filters.Pengarang.length > 0) {
      params.append("authorName", filters.Pengarang.join(","));
    }
    // Frontend mengirimkan parameter 'year' dengan benar
    if (filters["Tahun Terbit"].length > 0) {
      params.append("year", filters["Tahun Terbit"][0]); 
    }
    
    // Untuk debugging jika masalah masih di frontend:
    // console.log("Parameter yang dikirim ke API:", params.toString());

    try {
      const responseData = await get<PaginatedResponse>("/books/search", {
        params,
      });
      setBooks(responseData.data);
      setTotalPages(responseData.pagination.totalPages);
      setCurrentPage(responseData.pagination.currentPage);
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      setError(apiError.message || "Gagal memuat data buku.");
      setBooks([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialDataAndOptions = async () => {
      setLoading(true);
      setError(null);
      try {
        const optionsResponse = await get<PaginatedResponse>("/books/search", {
          params: { page: 1, pageSize: 1000 }, 
        });

        const allBooksForOptions = optionsResponse.data;

        const categoryNames = allBooksForOptions
          .map((book) => book.category?.name)
          .filter((name): name is string => Boolean(name));
        const uniqueCategories = [...new Set(categoryNames)];

        const authorNames = allBooksForOptions.map((book) => book.author.name);
        const uniqueAuthors = [...new Set(authorNames)];

        const publicationYearsRaw = allBooksForOptions.map((book) => book.year);
        const publicationYearsFiltered = publicationYearsRaw
          .filter((year): year is number => typeof year === 'number' && !isNaN(year));
        const uniqueYearStrings = [...new Set(publicationYearsFiltered)]
          .map(String)
          .sort((a, b) => parseInt(b) - parseInt(a)); 

        setDynamicOptions({
          Kategori: uniqueCategories.sort(),
          Pengarang: uniqueAuthors.sort(),
          "Tahun Terbit": uniqueYearStrings,
        });

        await fetchBooksByPage(1, { Kategori: [], Pengarang: [], "Tahun Terbit": [] });
        isInitialMount.current = false; 

      } catch (err) {
        const apiError = err as ApiErrorResponse;
        setError(apiError.message || "Gagal memuat data awal dan opsi filter.");
        setLoading(false);
        isInitialMount.current = false; 
      }
    };

    fetchInitialDataAndOptions();
  }, []); 

  useEffect(() => {
    if (isInitialMount.current) {
      return;
    }
    fetchBooksByPage(currentPage, selectedFilters);
  }, [currentPage, selectedFilters]);


  const handleFilterChange = (filterType: string, option: string) => {
    let newAppliedFilters: Record<string, string[]> | null = null;

    setSelectedFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      const currentSelection = newFilters[filterType] || [];

      if (filterType === "Tahun Terbit") {
        if (currentSelection.includes(option)) {
          newFilters[filterType] = [];
        } else {
          newFilters[filterType] = [option];
        }
      } else {
        if (currentSelection.includes(option)) {
          newFilters[filterType] = currentSelection.filter((item) => item !== option);
        } else {
          newFilters[filterType] = [...currentSelection, option];
        }
      }
      newAppliedFilters = newFilters; // Simpan filter baru untuk dipanggil
      return newFilters;
    });
    
    // Pindahkan logika paginasi dan fetch ke setelah state diupdate
    // Ini akan menggunakan nilai newAppliedFilters yang sudah diupdate
    // setTimeout untuk memastikan state selectedFilters benar-benar terupdate sebelum fetch
    setTimeout(() => {
        if (newAppliedFilters) {
            if (currentPage !== 1) {
                setCurrentPage(1); 
                // useEffect [currentPage, selectedFilters] akan menangani fetch
            } else {
                // Jika sudah di halaman 1, selectedFilters berubah, useEffect akan fetch
                // Jika selectedFilters tidak berubah (misal, deselect tahun yang sama),
                // dan currentPage sudah 1, maka fetch manual diperlukan
                fetchBooksByPage(1, newAppliedFilters);
            }
        }
    }, 0);
  };
  
  const paginationRange = totalPages > 0 ? generatePaginationRange(currentPage, totalPages) : [];

  const getFilteredOptions = (filterType: string) => {
    const allOptions = dynamicOptions[filterType] || [];
    const searchTerm = filterSearchTerms[filterType]?.toLowerCase() || "";
    if (!searchTerm) return allOptions;
    return allOptions.filter((opt) => opt.toLowerCase().includes(searchTerm));
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Header />
      <section className="px-4 sm:px-6 lg:px-8 py-6 bg-white shadow mb-8">
        <div className="flex flex-wrap sm:flex-nowrap justify-start sm:justify-between gap-4 sm:gap-6">
          {FILTERS.map((f) => {
            const isTahunTerbit = f === "Tahun Terbit";
            const filteredOptions = activeFilter === f ? getFilteredOptions(f) : [];
            const positionClasses =
              isTahunTerbit
                ? "left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0"
                : "left-1/2 -translate-x-1/2 sm:left-0 sm:right-auto sm:translate-x-0";

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
                      positionClasses
                    }`}
                  >
                    <input
                      type="text"
                      placeholder={`Cari ${f}...`}
                      value={filterSearchTerms[f]}
                      onChange={(e) =>
                        setFilterSearchTerms({
                          ...filterSearchTerms,
                          [f]: e.target.value,
                        })
                      }
                      className="w-full mb-4 rounded-full bg-gray-200 text-gray-700 placeholder-gray-500 pl-4 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
                    />
                    <ul className="space-y-2 text-sm">
                      {filteredOptions.length > 0 ? (
                        filteredOptions.map((opt) => (
                          <li key={opt} className="flex items-center">
                            <input
                              type={isTahunTerbit ? "radio" : "checkbox"}
                              id={`${f}-${opt}`}
                              name={isTahunTerbit ? "tahunTerbitOption" : `${f}-${opt}`}
                              className="mr-2 w-4 h-4 text-green-500 focus:ring-green-400"
                              checked={selectedFilters[f]?.includes(opt) || false}
                              onChange={() => handleFilterChange(f, opt)}
                            />
                            <label htmlFor={`${f}-${opt}`} className="text-gray-800 truncate">
                              {opt}
                            </label>
                          </li>
                        ))
                      ) : (
                        <li className="text-center text-gray-500">Tidak ada data</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Rekomendasi Buku</h2>
        {loading && <p className="text-center text-gray-600 py-10">Memuat buku...</p>}
        {error && <p className="text-center text-red-500 py-10">{error}</p>}
        {!loading && !error && books.length === 0 && (
           <p className="text-center text-gray-500 py-10">Tidak ada buku yang ditemukan dengan filter ini.</p>
        )}
        {!loading && !error && books.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
              {books.map((book, index) => ( // Menambahkan index untuk priority
                <Link key={book.isbn} href={`/books/${book.isbn}`} className="group flex flex-col">
                  <div className="w-full aspect-[3/4] bg-gray-200 rounded-lg border border-gray-300 relative overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">
                    <Image
                      src={book.cover || "/placeholder-cover.jpg"} 
                      alt={`Sampul buku ${book.title}`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover"
                      priority={index < 4} // Memberi prioritas pada 4 gambar pertama
                    />
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-green-600 transition-colors">{book.title}</p>
                    <p className="text-xs text-gray-600 line-clamp-1">{book.author.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{book.year}</p>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
                <div className="mt-12 flex justify-center sm:justify-end items-center space-x-1 sm:space-x-2">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    Prev
                </button>
                {paginationRange.map((pageNumber, index) =>
                    typeof pageNumber === "string" ? (
                    <span key={`dots-${index}`} className="px-2 py-1.5 sm:px-3 sm:py-2 text-gray-700">...</span>
                    ) : (
                    <button
                        key={`page-${pageNumber}`}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md border border-gray-400 text-sm transition ${
                        currentPage === pageNumber 
                            ? "bg-green-500 text-white border-green-500" 
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                        {pageNumber}
                    </button>
                    )
                )}
                <button
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    Next
                </button>
                </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}