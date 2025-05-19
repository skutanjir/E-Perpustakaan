// app/verify-email/page.tsx
"use client";

import React from "react";
import Image from "next/image";

export default function VerifyEmail(): JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image src="/logo.png" alt="E-Pustaka Logo" width={120} height={120} />
        </div>

        {/* Verifikasi Panel */}
        <div className="bg-[white] text-black rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-2">Verifikasi Email</h2>
          <p className="text-sm mb-4">
            Masukkan 6 digit kode verifikasi yang dikirim ke:
          </p>
          <p className="font-medium mb-6">Pustakaan@gmail.com</p>

          <div className="relative">
            <input
              type="text"
              placeholder="Masukkan Kode Verifikasi"
              className="w-full rounded-full bg-gray-200 text-gray-800 placeholder-gray-500 
                         pl-4 pr-24 py-3 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-[#2e4d3d] 
                         px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-100 transition"
            >
              Resend
            </button>
          </div>
        </div>

        {/* Selanjutnya */}
        <button
          type="button"
          className="block mx-auto bg-blue-700 text-white rounded-full px-8 py-2 text-lg 
                     hover:bg-blue-800 transition"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
}
