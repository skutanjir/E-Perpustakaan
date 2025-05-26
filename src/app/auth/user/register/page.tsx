"use client";

import React, { JSX, useState, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { post } from "@/lib/api/apiService";
import type { ApiErrorResponse } from "@/lib/api/apiService";

// Define a type for the expected successful API response (if any)
interface RegisterSuccessResponse {
  message: string;
  userId?: string;
}

export default function MahasiswaRegister(): JSX.Element {
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [nrp, setNrp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "nama") setNama(value);
    else if (name === "nrp") setNrp(value);
    else if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);

    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (error) setError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setSuccessMessage(null);

    const currentFieldErrors: Record<string, string> = {};
    if (!nama.trim()) currentFieldErrors.nama = "Nama tidak boleh kosong.";
    if (!nrp.trim()) currentFieldErrors.nrp = "NRP tidak boleh kosong.";
    if (!email.trim()) {
      currentFieldErrors.email = "Email tidak boleh kosong.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      currentFieldErrors.email = "Format email tidak valid.";
    }
    if (!password) {
      currentFieldErrors.password = "Password tidak boleh kosong.";
    } else if (password.length < 6) {
      currentFieldErrors.password = "Password minimal 6 karakter.";
    }

    if (Object.keys(currentFieldErrors).length > 0) {
      setFieldErrors(currentFieldErrors);
      return;
    }

    setIsLoading(true);

    const payload = {
      id: nrp,
      name: nama,
      email: email,
      password: password,
    };

    try {
      const response = await post<RegisterSuccessResponse, typeof payload>("/users", payload);

      setSuccessMessage(response.message || "Registrasi berhasil! Anda akan dialihkan ke halaman login.");
      setNama("");
      setNrp("");
      setEmail("");
      setPassword("");
      setShowPassword(false);

      setTimeout(() => {
        router.push("/auth/user/login");
      }, 1000);

    } catch (apiError) {
      const err = apiError as ApiErrorResponse;
      if (err.errors && Array.isArray(err.errors)) {
        const backendFieldErrors: Record<string, string> = {};
        err.errors.forEach(fieldError => {
          if (fieldError.field && fieldError.message) {
            backendFieldErrors[fieldError.field] = fieldError.message;
          }
        });
        if (Object.keys(backendFieldErrors).length > 0) {
          setFieldErrors(backendFieldErrors);
        }
      }
      setError(err.message || "Registrasi gagal. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <div className="flex justify-center mb-6">
            <Image
                src="/logo.png"
                alt="E-Pustaka Logo"
                width={100}
                height={100}
                priority
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Registrasi Pengguna
          </h2>

          {successMessage && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {successMessage}
              </div>
          )}
          {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {/* Nama */}
            <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A5.969 5.969 0 0112 15 a5.969 5.969 0 016.879 2.804M15 11 a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
              <input
                  type="text"
                  name="nama"
                  placeholder="Nama"
                  value={nama}
                  onChange={handleInputChange}
                  className={`w-full bg-gray-200 rounded-full pl-12 pr-4 py-2 text-gray-800 focus:outline-none focus:ring-2 ${fieldErrors.nama ? 'ring-red-500' : 'focus:ring-indigo-300'}`}
                  aria-invalid={!!fieldErrors.nama}
                  aria-describedby={fieldErrors.nama ? "nama-error" : undefined}
              />
              {fieldErrors.nama && <p id="nama-error" className="text-xs text-red-600 mt-1 pl-3">{fieldErrors.nama}</p>}
            </div>

            {/* NRP */}
            <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 21v-2a4 4 0 00-4-4H8 a4 4 0 00-4 4v2M12 11 a4 4 0 100-8 4 4 0 000 8z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 21h20M2 7h20" />
              </svg>
            </span>
              <input
                  type="text"
                  name="nrp"
                  placeholder="NRP"
                  value={nrp}
                  onChange={handleInputChange}
                  className={`w-full bg-gray-200 rounded-full pl-12 pr-4 py-2 text-gray-800 focus:outline-none focus:ring-2 ${fieldErrors.nrp ? 'ring-red-500' : 'focus:ring-indigo-300'}`}
                  aria-invalid={!!fieldErrors.nrp}
                  aria-describedby={fieldErrors.nrp ? "nrp-error" : undefined}
              />
              {fieldErrors.nrp && <p id="nrp-error" className="text-xs text-red-600 mt-1 pl-3">{fieldErrors.nrp}</p>}
            </div>

            {/* Email */}
            <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.293 5.293a1 1 0 001.414 0L19 8 m0 8H5a2 2 0 01-2-2V6 a2 2 0 012-2h14a2 2 0 012 2 v8a2 2 0 01-2 2z" />
              </svg>
            </span>
              <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={handleInputChange}
                  className={`w-full bg-gray-200 rounded-full pl-12 pr-4 py-2 text-gray-800 focus:outline-none focus:ring-2 ${fieldErrors.email ? 'ring-red-500' : 'focus:ring-indigo-300'}`}
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
              />
              {fieldErrors.email && <p id="email-error" className="text-xs text-red-600 mt-1 pl-3">{fieldErrors.email}</p>}
            </div>

            {/* Password */}
            <div className="relative">
             <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c-1.1046 0-2 .8954-2 2v2h4 v-2c0-1.1046-.8954-2-2-2zm6 2V9 a6 6 0 10-12 0v4m12 2H6 a2 2 0 01-2-2v-4a2 2 0 012-2h12 a2 2 0 012 2v4a2 2 0 01-2 2z" />
                </svg>
            </span>
              <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={handleInputChange}
                  className={`w-full bg-gray-200 rounded-full pl-12 pr-12 py-2 text-gray-800 focus:outline-none focus:ring-2 ${fieldErrors.password ? 'ring-red-500' : 'focus:ring-indigo-300'}`}
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={fieldErrors.password ? "password-error" : undefined}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600">
                {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19 c-4.478 0-8.268-2.943-9.542-7 a9.956 9.956 0 012.187-3.377m4.877-2.31 A9.955 9.955 0 0112 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7 -1.274 4.057-5.064 7-9.542 7 c-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
              {fieldErrors.password && <p id="password-error" className="text-xs text-red-600 mt-1 pl-3">{fieldErrors.password}</p>}
            </div>

            <button
                type="submit"
                className="w-full font-bold bg-indigo-600 text-white rounded-full py-2 hover:bg-indigo-700 transition disabled:opacity-50"
                disabled={isLoading}
            >
              {isLoading ? "Mendaftar..." : "Daftar"}
            </button>
          </form>

          <p className="text-center text-sm mt-4 text-gray-700">
            Sudah memiliki akun?{" "}
            <a href="/mahasiswa/login" className="text-indigo-600 font-medium hover:underline">
              Masuk Sekarang
            </a>
          </p>
        </div>
      </div>
  );
}