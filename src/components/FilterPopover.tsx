"use client";
import React, { useState, useEffect } from 'react';
import { get } from '@/lib/api/apiService';

interface Category {
  id: number;
  name: string;
}

interface FilterPopoverProps {
  onApplyFilters: (filters: { categoryId: string }) => void;
  initialFilters: { categoryId: string };
}

export default function FilterPopover({ onApplyFilters, initialFilters }: FilterPopoverProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState(initialFilters.categoryId);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const params = new URLSearchParams({ pageSize: '100' });
        const response = await get<{ data: Category[] }>('/categories', { params });
        setCategories(response.data);
      } catch (error: any) {
        console.error("Gagal mengambil kategori:", error.message || "Unknown error");
      }
    };
    fetchCategories();
  }, []);

  const handleApply = () => {
    onApplyFilters({ categoryId });
  };
  
  const handleReset = () => {
    setCategoryId('');
    onApplyFilters({ categoryId: '' });
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl p-6 z-50 border border-gray-200">
      <h4 className="font-bold text-gray-800 mb-4">Filter Pencarian</h4>
      <div className="space-y-4">
        <div>
          <label htmlFor="category" className="text-sm font-medium text-gray-700">Kategori</label>
          <select 
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full p-2 mt-1 border text-black border-gray-300 rounded-md text-sm"
          >
            <option value="">Semua Kategori</option>
            {categories.map(cat => (
              <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-center justify-between mt-6">
        <button onClick={handleReset} className="text-sm text-gray-600  hover:text-gray-900">Reset Filter</button>
        <button onClick={handleApply} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700">Terapkan</button>
      </div>
    </div>
  );
}