"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { Book } from "@/types";

interface BookSliderProps {
  books: Book[];
  isLoading?: boolean;
}

export default function BookSlider({ books, isLoading }: BookSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    if (currentIndex < books.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (sliderRef.current) {
      const item = sliderRef.current.children[currentIndex] as HTMLElement;
      if (item) {
        sliderRef.current.scrollTo({
          left: item.offsetLeft - 16, // penyesuaian untuk padding/margin
          behavior: "smooth",
        });
      }
    }
  }, [currentIndex]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [books]);

  if (isLoading) {
    return (
      <div className="text-center p-10 text-gray-500">Memuat buku...</div>
    );
  }
  if (!books || books.length === 0) {
    return (
      <div className="text-center p-10 text-gray-500">
        Buku tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="relative group">
      <div
        ref={sliderRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide space-x-4 p-4"
      >
        {books.map((book) => (
          // --- PERUBAHAN DI SINI ---
          <Link
            key={book.isbn} // DIUBAH: Menggunakan 'isbn' yang benar
            href={`/books/${book.isbn}`} // DIUBAH: Menggunakan 'isbn' yang benar
            className="snap-start flex-shrink-0 w-40"
          >
            <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer">
              <Image
                src={book.cover || "/placeholder-book.png"}
                alt={`Cover buku ${book.title}`}
                width={160}
                height={240}
                className="object-cover w-full h-48"
              />
              <div className="p-3">
                <h4
                  className="font-bold text-sm text-gray-800 truncate"
                  title={book.title}
                >
                  {book.title}
                </h4>
                <p
                  className="text-xs text-gray-600 truncate"
                  title={book.author.name}
                >
                  {book.author.name}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-0 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
        </button>
      )}

      {currentIndex < books.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-0 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <ChevronRightIcon className="w-6 h-6 text-gray-800" />
        </button>
      )}
    </div>
  );
}