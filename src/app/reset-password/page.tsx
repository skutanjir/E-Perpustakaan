// app/reset-password/page.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function ResetPassword(): JSX.Element {
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const EyeIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" fill="none"
         viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5
               c4.478 0 8.268 2.943 9.542 7
               -1.274 4.057-5.064 7-9.542 7
               c-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
  const EyeOffIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" fill="none"
         viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13.875 18.825A10.05 10.05 0 0112 19
               c-4.478 0-8.268-2.943-9.542-7
               a9.956 9.956 0 012.187-3.377m4.877-2.31
               A9.955 9.955 0 0112 5c4.478 0 8.268 2.943
               9.542 7-1.274 4.057-5.064 7-9.542 7z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 3l18 18" />
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image src="/logo.png" alt="E-Pustaka Logo" width={120} height={120} />
        </div>

        {/* Reset Panel */}
        <div className="bg-[white] text-black rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-2">Reset Password</h2>
          <p className="text-sm mb-4">
            Masukkan 6–8 karakter dan kombinasi untuk membuat password baru
          </p>

          {/* New Password */}
          <div className="relative mb-4">
            <input
              type={showPwd ? "text" : "password"}
              placeholder="Masukkan Password"
              className="w-full rounded-full bg-gray-200 text-gray-800 placeholder-gray-500 
                         pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute inset-y-0 right-0 flex items-center pr-4"
            >
              {showPwd ? EyeOffIcon : EyeIcon}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Konfirmasi Password"
              className="w-full rounded-full bg-gray-200 text-gray-800 placeholder-gray-500 
                         pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute inset-y-0 right-0 flex items-center pr-4"
            >
              {showConfirm ? EyeOffIcon : EyeIcon}
            </button>
          </div>
        </div>

        {/* Confirm & Login */}
        <button
          type="button"
          className="block mx-auto bg-blue-700 text-white rounded-full px-8 py-2 text-lg 
                     hover:bg-blue-800 transition"
        >
          Konfirmasi dan Login
        </button>
      </div>
    </div>
  );
}
