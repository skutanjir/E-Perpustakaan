"use client";
import React, { useState } from "react";
import Image from "next/image";



export default function AdminRegister(): JSX.Element {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Image src="/logo.png" alt="E-Pustaka Logo" width={200} height={200} />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Daftar Admin
        </h2>

        <form className="space-y-5">
          {/* Nama */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              {/* user icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M5.121 17.804A5.969 5.969 0 0112 15
                     a5.969 5.969 0 016.879 2.804M15 11
                     a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Nama"
              className="w-full bg-gray-200 rounded-full pl-12 pr-4 py-2 text-gray-800
                         focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          {/* NRP */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              {/* id-card icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 21v-2a4 4 0 00-4-4H8
                     a4 4 0 00-4 4v2M12 11
                     a4 4 0 100-8 4 4 0 000 8z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M2 21h20M2 7h20" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="NRP"
              className="w-full bg-gray-200 rounded-full pl-12 pr-4 py-2 text-gray-800
                         focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              {/* mail icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 8l7.293 5.293a1 1 0 001.414 0L19 8
                     m0 8H5a2 2 0 01-2-2V6
                     a2 2 0 012-2h14a2 2 0 012 2
                     v8a2 2 0 01-2 2z" />
              </svg>
            </span>
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-gray-200 rounded-full pl-12 pr-4 py-2 text-gray-800
                         focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              {/* lock icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 11c-1.1046 0-2 .8954-2 2v2h4
                     v-2c0-1.1046-.8954-2-2-2zm6 2V9
                     a6 6 0 10-12 0v4m12 2H6
                     a2 2 0 01-2-2v-4a2 2 0 012-2h12
                     a2 2 0 012 2v4a2 2 0 01-2 2z" />
              </svg>
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full bg-gray-200 rounded-full pl-12 pr-12 py-2 text-gray-800
                         focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600"
            >
              {showPassword ? (
                /* eye-off */
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19
                       c-4.478 0-8.268-2.943-9.542-7
                       a9.956 9.956 0 012.187-3.377m4.877-2.31
                       A9.955 9.955 0 0112 5c4.478 0 8.268 2.943
                       9.542 7-1.274 4.057-5.064 7-9.542 7
                       zm0 0l6 6" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 3l18 18" />
                </svg>
              ) : (
                /* eye */
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 
                       12 5c4.478 0 8.268 2.943 9.542 7
                       -1.274 4.057-5.064 7-9.542 7
                       c-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              {/* lock icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 11c-1.1046 0-2 .8954-2 2v2h4
                     v-2c0-1.1046-.8954-2-2-2zm6 2V9
                     a6 6 0 10-12 0v4m12 2H6
                     a2 2 0 01-2-2v-4a2 2 0 012-2h12
                     a2 2 0 012 2v4a2 2 0 01-2 2z" />
              </svg>
            </span>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Konfirmasi Password"
              className="w-full bg-gray-200 rounded-full pl-12 pr-12 py-2 text-gray-800
                         focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600"
            >
              {showConfirm ? (
                /* eye-off */
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin=" round" strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19
                       c-4.478 0-8.268-2.943-9.542-7
                       a9.956 9.956 0 012.187-3.377m4.877-2.31
                       A9.955 9.955 0 0112 5c4.478 0 8.268 2.943
                       9.542 7-1.274 4.057-5.064 7-9.542 7
                       zm0 0l6 6" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 3l18 18" />
                </svg>
              ) : (
                /* eye */
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 
                       12 5c4.478 0 8.268 2.943 9.542 7
                       -1.274 4.057-5.064 7-9.542 7
                       c-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white rounded-full py-2
                       hover:bg-indigo-700 transition"
          >
            Daftar
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-700">
          Sudah memiliki akun?{" "}
          <a href="/login/admin" className="text-indigo-600 font-medium hover:underline">
            Masuk Sekarang
          </a>
        </p>
      </div>
    </div>
  );
}