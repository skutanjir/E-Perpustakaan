"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import BookSlider from "./BookSlider"; 
import FilterPopover from "./FilterPopover";
import { Book } from "@/types";
import { get } from '@/lib/api/apiService';
import { useDebounce } from "@/hooks/useDebounce";

export default function Search() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [defaultBooks, setDefaultBooks] = useState<Book[]>([]);
  const [searchedBooks, setSearchedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ categoryId: '' });
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => { document.removeEventListener("mousedown", handleClickOutside); };
  }, []);

  const fetchApiBooks = useCallback(async (params: URLSearchParams, isSearch: boolean) => {
    setLoading(true);
    if (isSearch) {
        setSearchedBooks([]);
    }
    try {
      const response = await get<{ data: Book[] }>(`/books/search`, { params });
      const newBooks = response.data || [];
      if (isSearch) {
        setSearchedBooks(newBooks);
      } else {
        setDefaultBooks(newBooks);
      }
    } catch (error: any) {
      console.error("--- TERJADI ERROR SAAT FETCH API ---");
      if (error.statusCode || error.message) {
        console.error(`Status: ${error.statusCode || 'N/A'}`);
        console.error(`Pesan: ${error.message}`);
        console.error('Detail:', error.errors || 'Tidak ada detail tambahan.');
      } else {
        console.error("Error tidak terduga:", error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const hasActiveSearch = debouncedSearchQuery || filters.categoryId;
    
    if (!hasActiveSearch) {
        setIsSearching(false);
        if (defaultBooks.length === 0) {
            const params = new URLSearchParams({ pageSize: '20' });
            fetchApiBooks(params, false);
        }
        return;
    }

    setIsSearching(true);
    
    const params = new URLSearchParams();

    if (debouncedSearchQuery) {
        params.append('title', debouncedSearchQuery);
        // --- PERBAIKAN: Baris di bawah ini dihapus sesuai permintaan ---
        // params.append('authorName', debouncedSearchQuery); 
    }
    if (filters.categoryId) {
        params.append('categoryId', filters.categoryId);
    }
    
    params.append('pageSize', '100'); 

    fetchApiBooks(params, true);

  }, [debouncedSearchQuery, filters, fetchApiBooks, defaultBooks.length]);

  const handleApplyFilters = (newFilters: { categoryId: string }) => {
    setFilters(newFilters);
    setFilterOpen(false);
  };

  return (
    <div ref={searchRef} className="flex-1 mx-6 hidden lg:block">
      <div className="relative">
        <input type="text" placeholder="Cari berdasarkan judul..." className="w-full rounded-full bg-gray-200 text-gray-700 placeholder-gray-500 pl-4 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-green-300" onFocus={() => setDropdownOpen(true)} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
        {isDropdownOpen && (
          <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl p-4 z-40 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-gray-800">{isSearching ? `Hasil Pencarian` : "Rekomendasi Buku"}</h3>
              <div className="relative">
                <button onClick={() => setFilterOpen(prev => !prev)} className="flex items-center space-x-2 text-sm bg-gray-100 text-black border-1 border-black hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"><AdjustmentsHorizontalIcon className="w-5 h-5" /><span>Filter</span></button>
                {isFilterOpen && (<FilterPopover onApplyFilters={handleApplyFilters} initialFilters={filters} />)}
              </div>
            </div>
            <BookSlider 
              books={isSearching ? searchedBooks : defaultBooks} 
              isLoading={loading} 
            />
          </div>
        )}
      </div>
    </div>
  );
}