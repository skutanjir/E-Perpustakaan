// app/mahasiswa/login/page.tsx
"use client";

import React, { JSX, useState, FormEvent } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation"; // For App Router
import { post } from "@/lib/api/apiService";
// import type { ApiErrorResponse } from "@/lib/api/apiService";

// Define expected response types
interface LoginSuccessData {
  accessToken: string;
  refreshToken: string;
}

interface LoginApiResponse { // This is what your 'post' utility's Promise<T> will resolve to
  data?: LoginSuccessData;
  error?: string | Array<{[key: string]: string}>;
}

export default function MahasiswaLogin(): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Use your 'post' utility function
      // The type argument LoginApiResponse defines the expected structure of a successful response *or* an API error response
      // that might still come with a 2xx status but indicates a business logic error if not structured for success.
      // However, typically, non-2xx errors would be thrown by an Axios-like utility.
      const result = await post<LoginApiResponse>("/users/login", { email, password });
      console.log(result.data);
      // Assuming 'post' resolves with the parsed JSON data directly for successful responses (2xx)
      // and throws an error for non-2xx responses which will be caught by the catch block.
      if (result.data && result.data.accessToken && result.data.refreshToken) {
        Cookies.set("accessToken", result.data.accessToken, { expires: 1 / 24 * 0.5 }); // 30 minutes
        Cookies.set("refreshToken", result.data.refreshToken, { expires: 7 }); // 7 days

        setLoading(false);
        router.push("/books");
      } else {
        // This case might be hit if the API returns a 2xx status but the data structure is not as expected
        // or if 'post' utility doesn't throw for certain "soft" API errors.
        const errorMessage = result.error || "Login successful, but token data is missing.";
        if (Array.isArray(result.error) && result.error.length > 0) {
          const firstErrorKey = Object.keys(result.error[0])[0];
          setError(result.error[0][firstErrorKey] || "Login failed.");
        } else {
          setError(errorMessage as string);
        }
        setLoading(false);
      }

    } catch (err: any) { // Catch block will handle errors thrown by 'post' (e.g., network errors, non-2xx statuses)
      console.error("Login API call error:", err);
      // Attempt to parse error message from an Axios-like error structure
      // where the actual API error response is in err.response.data
      const apiError = err.response?.data;
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (apiError) {
        if (Array.isArray(apiError.error) && apiError.error.length > 0) {
          const firstErrorKey = Object.keys(apiError.error[0])[0];
          errorMessage = apiError.error[0][firstErrorKey] || "Login failed.";
        } else if (typeof apiError.error === 'string') {
          errorMessage = apiError.error;
        } else if (typeof apiError.message === 'string') {
          errorMessage = apiError.message;
        }
      } else if (err.message) {
        // Fallback to error.message if no err.response.data
        errorMessage = err.message;
      }

      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
        <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-10 w-full max-w-md">
          <div className="flex justify-center mb-6">
            <Image
                src="/logo.png" // Ensure this path is correct (public/logo.png)
                alt="E-Pustaka Logo"
                width={150} // Adjusted size for better aesthetics
                height={150}
                priority // Good for LCP
                className="rounded-full"
            />
          </div>

          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Masuk Pengguna
          </h2>

          {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg text-sm">
                {error}
              </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M3 8l7.293 5.293a1 1 0 001.414 0L19 8m0 8H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2z" />
              </svg>
            </span>
              <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Alamat Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-100 border-gray-300 rounded-lg pl-12 pr-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out"
              />
            </div>

            {/* Password */}
            <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M12 11c-1.1046 0-2 .8954-2 2v2h4v-2c0-1.1046-.8954-2-2-2zm6 2V9a6 6 0 10-12 0v4m12 2H6a2 2 0 01-2-2v-4a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2z" />
              </svg>
            </span>
              <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Kata Sandi"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-100 border-gray-300 rounded-lg pl-12 pr-12 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out"
              />
              <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-600 hover:text-indigo-600 focus:outline-none"
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              >
                {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                         viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.187-3.377m4.877-2.31A9.955 9.955 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.95 9.95 0 00-2.063 3.396M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                         viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7c-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                )}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <a href="/reset-password" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition duration-150 ease-in-out">
                Lupa Password?
              </a>
            </div>

            {/* Submit Button */}
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
                  "Masuk"
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-8 text-gray-600">
            Belum memiliki akun?{" "}
            <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline transition duration-150 ease-in-out">
              Daftar Sekarang
            </a>
          </p>
        </div>
      </div>
  );
}