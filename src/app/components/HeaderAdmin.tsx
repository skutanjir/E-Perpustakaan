"use client";

import { useState, useRef, useEffect } from "react";
import { UserIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export default function HeaderAdmin(): JSX.Element {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);
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
      clearTimeout(userCloseTimeout);
    };
  }, []);

  function handleUserMouseEnter() {
    clearTimeout(userCloseTimeout);
    setUserMenuOpen(true);
  }

  function handleUserMouseLeave() {
    userCloseTimeout = setTimeout(() => setUserMenuOpen(false), 150);
  }

  return (
    <header className="bg-gray-100 shadow-md relative z-50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Kiri: Logo */}
        <Image
          src="/logo.png"
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
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
            aria-label="User menu"
            type="button"
          >
            <UserIcon className="w-6 h-6" />
          </button>

          {userMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl ring-1 ring-black ring-opacity-5 z-10">
              <button
                className="w-full flex items-center justify-center text-red-600 hover:text-red-800 p-3 text-sm rounded-b-2xl"
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
