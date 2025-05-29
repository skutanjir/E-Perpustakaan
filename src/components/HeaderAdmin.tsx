"use client";

import React, { useState, useRef, useEffect, JSX } from "react"; // JSX ditambahkan
import { UserIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Cookies from "js-cookie"; // 1. Impor Cookies
import { useRouter } from "next/navigation"; // 2. Impor useRouter

export default function HeaderAdmin(): JSX.Element {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);
  const router = useRouter(); // Inisialisasi router
  let userCloseTimeout: ReturnType<typeof setTimeout>;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      clearTimeout(userCloseTimeout); // Pastikan timeout di-clear
    };
  }, [userCloseTimeout]); // Tambahkan userCloseTimeout ke dependency array jika nilainya bisa berubah dan dibaca di effect

  function handleUserMouseEnter() {
    clearTimeout(userCloseTimeout);
    setUserMenuOpen(true);
  }

  function handleUserMouseLeave() {
    userCloseTimeout = setTimeout(() => setUserMenuOpen(false), 150);
  }

  // 3. Tambahkan fungsi handleLogout
  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken"); // Pastikan refreshToken juga dihapus jika ada
    router.push("/auth/user/login"); // Arahkan ke halaman login admin atau login umum
                                    // Sesuaikan path jika halaman login admin berbeda
  };

  return (
    <header className="bg-gray-100 shadow-md relative z-50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Kiri: Logo */}
        <Image
          src="/logo.png" // Pastikan path logo benar
          alt="E-Pustaka Logo"
          width={120}
          height={40}
          priority
        />

        {/* Tengah: Kosong */}
        <div className="flex-1" />

        {/* Kanan: Icon profil */}
        <div
          ref={userRef}
          className="relative"
          onMouseEnter={handleUserMouseEnter}
          onMouseLeave={handleUserMouseLeave}
        >
          <button
            onClick={() => setUserMenuOpen((prev) => !prev)}
            className="text-gray-600 hover:text-gray-800 focus:outline-none p-1 rounded-full" // Tambah padding & rounded untuk area klik lebih baik
            aria-label="User menu"
            type="button"
          >
            <UserIcon className="w-6 h-6" />
          </button>

          {userMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 z-10 overflow-hidden">
              {/* Anda bisa menambahkan info admin di sini jika perlu, seperti nama/email */}
              {/* Contoh:
              <div className="p-4 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-700">Nama Admin</p>
                <p className="text-xs text-gray-500">admin@example.com</p>
              </div>
              */}
              <button
                // 4. Hubungkan tombol dengan handleLogout
                onClick={handleLogout} 
                className="w-full flex items-center text-red-600 hover:text-red-800 hover:bg-red-50 p-3 text-sm transition-colors duration-150"
                type="button"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                Keluar dari Aplikasi
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}