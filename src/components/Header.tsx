"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  HomeIcon,
  BellIcon,
  UserIcon,
  MagnifyingGlassIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface HeaderMahasiswaProps {
  id: string; // tambahkan props id
}

export default function HeaderMahasiswa({ id }: HeaderMahasiswaProps): JSX.Element {
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  let notifCloseTimeout: ReturnType<typeof setTimeout>;
  let userCloseTimeout: ReturnType<typeof setTimeout>;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      clearTimeout(notifCloseTimeout);
      clearTimeout(userCloseTimeout);
    };
  }, []);

  function handleNotifMouseLeave() {
    notifCloseTimeout = setTimeout(() => setNotifOpen(false), 150);
  }

  function handleNotifMouseEnter() {
    clearTimeout(notifCloseTimeout);
    setNotifOpen(true);
  }

  function handleUserMouseLeave() {
    userCloseTimeout = setTimeout(() => setUserMenuOpen(false), 150);
  }

  function handleUserMouseEnter() {
    clearTimeout(userCloseTimeout);
    setUserMenuOpen(true);
  }

  return (
    <header className="bg-gray-100 shadow-md relative z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <Image src="/logo.png" alt="E-Pustaka Logo" width={120} height={40} priority />

        <div className="flex-1 mx-6 hidden lg:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari judul buku..."
              className="w-full rounded-full bg-gray-200 text-gray-700 placeholder-gray-500 pl-4 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <a href="/beranda" className="text-gray-600 hover:text-gray-800 flex items-center">
            <HomeIcon className="w-6 h-6" />
          </a>

          {/* Notifikasi */}
          <div
            ref={notifRef}
            className="relative flex items-center"
            onMouseEnter={handleNotifMouseEnter}
            onMouseLeave={handleNotifMouseLeave}
          >
            <button
              className="text-gray-600 hover:text-gray-800 focus:outline-none flex items-center"
              onClick={() => setNotifOpen((prev) => !prev)}
              aria-label="Toggle notifications"
              type="button"
            >
              <BellIcon className="w-6 h-6" />
            </button>

            {notifOpen && (
              <div className="absolute top-full mt-2 right-0 w-72 bg-white rounded-2xl shadow-xl ring-1 ring-black ring-opacity-5">
                <div className="p-5">
                  <p className="font-semibold text-gray-800 text-center">Pemberitahuan</p>
                  <hr className="my-2 border-gray-300" />
                  <p className="text-center text-sm text-gray-600">Tidak Ada Notifikasi</p>
                </div>
              </div>
            )}
          </div>

          {/* User */}
          <div
            ref={userRef}
            className="relative flex items-center"
            onMouseEnter={handleUserMouseEnter}
            onMouseLeave={handleUserMouseLeave}
          >
            <button
              onClick={() => setUserMenuOpen((prev) => !prev)}
              className="flex items-center text-gray-600 hover:text-gray-800 focus:outline-none"
              aria-label="User menu toggle"
              type="button"
            >
              <UserIcon className="w-6 h-6" />
            </button>

            {userMenuOpen && (
              <div className="absolute top-full mt-2 right-0 w-72 bg-white rounded-2xl shadow-xl ring-1 ring-black ring-opacity-5">
                <div className="flex items-center p-5 bg-[#466881] rounded-t-2xl text-white">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-5" />
                  <div className="flex flex-col">
                    <p className="font-semibold text-lg leading-tight">Nasya Amelia</p>
                    <p className="text-sm opacity-80 leading-snug">nasyamelia@gmail.com</p>
                    <Link href={`/beranda/profile/${id}`} passHref>
                      <button
                        className="mt-4 bg-[#789791] text-white text-base px-5 py-2 rounded-full hover:bg-[#8fa69f] transition w-max"
                        type="button"
                      >
                        Lihat Profil
                      </button>
                    </Link>
                  </div>
                </div>

                <div className="flex justify-around p-6">
                  <a
                    href="/beranda/rak-pinjam"
                    className="flex flex-col items-center text-gray-700 hover:text-gray-900"
                  >
                    <div className="bg-gradient-to-tr from-[#466881] to-[#789791] rounded-full p-3 mb-1">
                      <HomeIcon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs">Rak Pinjam</span>
                  </a>

                  <a
                    href="/bantuan"
                    className="flex flex-col items-center text-gray-700 hover:text-gray-900"
                  >
                    <div className="bg-gradient-to-tr from-[#466881] to-[#789791] rounded-full p-3 mb-1">
                      <BellIcon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs">Bantuan</span>
                  </a>

                  <a
                    href="/reset-password"
                    className="flex flex-col items-center text-gray-700 hover:text-gray-900"
                  >
                    <div className="bg-gradient-to-tr from-[#466881] to-[#789791] rounded-full p-3 mb-1">
                      <ExclamationCircleIcon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs">Reset Password</span>
                  </a>
                </div>

                <hr className="border-gray-200" />
                <button
                  className="w-full flex items-center justify-center text-red-600 hover:text-red-800 p-3 text-sm rounded-b-2xl"
                  type="button"
                >
                  <ExclamationCircleIcon className="w-5 h-5 mr-2" />
                  Keluar dari Aplikasi
                </button>
              </div>
            )}
          </div>

          {/* Mobile Search Toggle */}
          <button
            className="text-gray-600 hover:text-gray-800 focus:outline-none lg:hidden"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Toggle mobile search"
            type="button"
          >
            <MagnifyingGlassIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-100 px-6 py-4 shadow-md lg:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari judul buku..."
              className="w-full rounded-full bg-gray-200 text-gray-700 placeholder-gray-500 pl-4 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
      )}
    </header>
  );
}
