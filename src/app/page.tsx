// app/page.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";

const NAV_ITEMS = ["Home", "Services", "Contact", "About"];

export default function Home(): JSX.Element {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);

  // Icons
  const hamburgerIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none"
         viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
  const closeIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none"
         viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
  const searchIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="currentColor"
         viewBox="0 0 24 24">
      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5
               6.5 6.5 0 109.5 16c1.61 0 3.09-.59
               4.23-1.57l.27.28v.79l5 4.99-1.49 1.49-4.99-5zM9.5
               14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5
               14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-900 to-gray-200 overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-gray-200/30 rounded-full mix-blend-lighten" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gray-200/30 rounded-full mix-blend-lighten" />

      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-30 bg-transparent max-w-7xl mx-auto flex items-center justify-between py-4 px-4 sm:px-8">
        {/* Logo */}
        <Image src="/logo1.png" alt="E-Pustaka Logo" width={150} height={150} />

        {/* Desktop nav */}
        <nav className="hidden md:flex space-x-6">
          {NAV_ITEMS.map((label) => (
            <a key={label} href="#" className="text-white hover:text-gray-200 transition">
              {label}
            </a>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-label="Toggle menu"
          className="md:hidden p-2 text-white hover:text-gray-200 focus:outline-none z-30"
        >
          {mobileNavOpen ? closeIcon : hamburgerIcon}
        </button>

        {/* Auth buttons (desktop) */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Daftar (white) */}
          <div className="relative">
            <button
              onClick={() => { setOpenRegister(!openRegister); setOpenLogin(false); }}
              className="px-4 sm:px-6 py-2 bg-white text-gray-800 rounded hover:bg-gray-100 transition"
            >
              Daftar
            </button>
            {openRegister && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black/10">
                <a href="/daftar/mahasiswa" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  Mahasiswa
                </a>
                <a href="/daftar/admin" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  Admin
                </a>
              </div>
            )}
          </div>

          {/* Masuk (dark green) */}
          <div className="relative">
            <button
              onClick={() => { setOpenLogin(!openLogin); setOpenRegister(false); }}
              className="px-4 sm:px-6 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition"
            >
              Masuk
            </button>
            {openLogin && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black/10">
                <a href="/login/mahasiswa" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  Mahasiswa
                </a>
                <a href="/login/admin" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  Admin
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile nav menu (white bg) */}
      {mobileNavOpen && (
        <nav className="md:hidden fixed top-16 inset-x-0 bg-white text-gray-800 shadow-lg z-20">
          <div className="flex flex-col space-y-2 py-4 px-4">
            {NAV_ITEMS.map((label) => (
              <a key={label} href="#" className="block py-2 hover:bg-gray-100 rounded">
                {label}
              </a>
            ))}

            {/* Mobile auth */}
            <div className="border-t border-gray-200 mt-2 pt-2 space-y-2">
              <button
                onClick={() => { setOpenRegister(!openRegister); setOpenLogin(false); }}
                className="w-full text-left px-4 py-2 bg-white text-gray-800 rounded hover:bg-gray-100 transition"
              >
                Daftar
              </button>
              {openRegister && (
                <div className="mt-1 space-y-1 px-4">
                  <a href="/daftar/mahasiswa" className="block py-1 bg-gray-50 text-gray-800 rounded hover:bg-gray-100 text-center">
                    Mahasiswa
                  </a>
                  <a href="/daftar/admin" className="block py-1 bg-gray-50 text-gray-800 rounded hover:bg-gray-100 text-center">
                    Admin
                  </a>
                </div>
              )}
              <button
                onClick={() => { setOpenLogin(!openLogin); setOpenRegister(false); }}
                className="w-full text-left px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition"
              >
                Masuk
              </button>
              {openLogin && (
                <div className="mt-1 space-y-1 px-4">
                  <a href="/login/mahasiswa" className="block py-1 bg-white text-gray-800 rounded hover:bg-gray-100 text-center">
                    Mahasiswa
                  </a>
                  <a href="/login/admin" className="block py-1 bg-white text-gray-800 rounded hover:bg-gray-100 text-center">
                    Admin
                  </a>
                </div>
              )}
            </div>
          </div>
        </nav>
      )}

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 flex flex-col-reverse md:flex-row items-center pt-24 md:pt-32 gap-8">
        {/* Text & Search */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            Melayani Peminjaman Buku
            <br />
            Secara Online ataupun Offline
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-200">
            E-Pustaka hadir untuk mempermudah Anda meminjam buku
          </p>

          <div className="mt-6">
            <div className="relative w-full sm:w-3/4 lg:w-2/3 mx-auto md:mx-0">
              {/* Search icon */}
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                {searchIcon}
              </span>
              <input
                type="text"
                placeholder="Cari judul buku..."
                className="relative z-0 w-full pl-12 pr-4 py-3 bg-white/30 backdrop-blur-sm rounded-full placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
          </div>
        </div>

        {/* Illustration */}
        <div className="md:w-1/2 flex justify-center">
          <Image
            src="/logohomes.png"
            alt="Ilustrasi baca buku"
            width={500}
            height={400}
            priority
            className="max-w-full h-auto"
          />
        </div>
      </main>
    </div>
  );
}
