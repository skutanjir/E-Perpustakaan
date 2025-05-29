// app/reset-password/page.tsx
"use client";

import React, { useState, FormEvent, JSX } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
// Asumsikan apiService Anda diekspor seperti ini, atau sesuaikan pathnya
import { apiRequest, ApiErrorResponse } from "@/lib/api/apiService";
import { LockClosedIcon } from "@heroicons/react/24/outline"; // Import ikon gembok

// Define expected response types
interface ResetPasswordSuccessData {
  message: string;
}

interface ResetPasswordApiResponse {
  data?: ResetPasswordSuccessData;
  error?: string | Array<{ [key: string]: string }>; // Sesuai dengan error backend Anda
}

export default function ResetPasswordPage(): JSX.Element {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError("Password baru dan konfirmasi password tidak cocok.");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6 || newPassword.length > 20) { // Sesuaikan batas panjang jika perlu
      setError("Password baru harus terdiri dari 6–20 karakter.");
      setLoading(false);
      return;
    }

    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      setError("Sesi tidak ditemukan. Silakan login kembali.");
      setLoading(false);
      // Arahkan ke login jika tidak ada token, karena endpoint ini butuh otentikasi
      router.push("/auth/user/login");
      return;
    }

    try {
      const requestBody = {
        currentPassword,
        newPassword,
        confirmPassword,
      };

      // Menggunakan apiRequest dengan metode PATCH
      const result = await apiRequest<ResetPasswordApiResponse, typeof requestBody>(
        'patch', // Metode HTTP
        '/users/current', // URL endpoint
        requestBody,      // Body permintaan
        {                 // Opsi config Axios (termasuk header jika tidak ditangani otomatis)
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (result.data && result.data.message) {
        setSuccessMessage(result.data.message);
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        
        // Beri jeda sedikit agar pengguna bisa membaca pesan sukses sebelum redirect
        setTimeout(() => {
          router.push("/auth/user/login");
        }, 1000); // Redirect setelah 2 detik
      } else {
         // Jika API merespons sukses tapi data tidak sesuai
        setError( typeof result.error === 'string' ? result.error : "Gagal mereset password, respons tidak sesuai.");
      }
    } catch (err: any) {
      const apiError = err as ApiErrorResponse;
      setError(apiError.error || apiError.message || "Gagal mereset password. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
      <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-10 w-full max-w-lg">
        <div className="flex justify-center mb-6">
          <Image src="/logo.png" alt="E-Pustaka Logo" width={100} height={100} className="rounded-full"/>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Reset Password</h2>
        <p className="text-sm text-gray-600 text-center mb-8">
          Perbarui password Anda. Pastikan password baru kuat dan mudah diingat.
        </p>

        {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg text-sm text-center">
                {error}
            </div>
        )}
        {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded-lg text-sm text-center">
                {successMessage}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div className="relative">
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Password Lama</label>
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pt-7 text-gray-400 pointer-events-none">
                    <LockClosedIcon className="w-5 h-5" />
                </span>
                <input
                    id="currentPassword"
                    type={showCurrentPwd ? "text" : "password"}
                    placeholder="Masukkan Password Lama Anda"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full bg-gray-100 border-gray-300 rounded-lg pl-12 pr-12 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out"
                />
                <button
                    type="button"
                    onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 pt-6 text-gray-600 hover:text-indigo-600"
                    aria-label={showCurrentPwd ? "Sembunyikan password lama" : "Tampilkan password lama"}
                >
                    {showCurrentPwd ? EyeOffIcon : EyeIcon}
                </button>
            </div>
            
            {/* New Password */}
            <div className="relative">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pt-7 text-gray-400 pointer-events-none">
                    <LockClosedIcon className="w-5 h-5" />
                </span>
                <input
                    id="newPassword"
                    type={showNewPwd ? "text" : "password"}
                    placeholder="Masukkan Password Baru (6-20 karakter)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    maxLength={20} // Tambahkan maxLength jika perlu
                    className="w-full bg-gray-100 border-gray-300 rounded-lg pl-12 pr-12 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out"
                />
                <button
                    type="button"
                    onClick={() => setShowNewPwd(!showNewPwd)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 pt-6 text-gray-600 hover:text-indigo-600"
                    aria-label={showNewPwd ? "Sembunyikan password baru" : "Tampilkan password baru"}
                >
                    {showNewPwd ? EyeOffIcon : EyeIcon}
                </button>
            </div>

            {/* Confirm New Password */}
            <div className="relative">
                 <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pt-7 text-gray-400 pointer-events-none">
                    <LockClosedIcon className="w-5 h-5" />
                </span>
                <input
                    id="confirmPassword"
                    type={showConfirmPwd ? "text" : "password"}
                    placeholder="Ulangi Password Baru Anda"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full bg-gray-100 border-gray-300 rounded-lg pl-12 pr-12 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out"
                />
                <button
                    type="button"
                    onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 pt-6 text-gray-600 hover:text-indigo-600"
                    aria-label={showConfirmPwd ? "Sembunyikan konfirmasi password" : "Tampilkan konfirmasi password"}
                >
                    {showConfirmPwd ? EyeOffIcon : EyeIcon}
                </button>
            </div>
            
            <p className="text-xs text-gray-500 text-center px-2">
                Password baru harus terdiri dari 6–20 karakter, disarankan menggunakan kombinasi huruf, angka, dan simbol.
            </p>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white rounded-lg py-3 font-semibold text-center hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-75 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Memproses...
                    </span>
                ) : (
                    "Reset Password dan Login Ulang"
                )}
            </button>
        </form>
      </div>
    </div>
  );
}