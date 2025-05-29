// app/admin/layout.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { FiLoader } from "react-icons/fi";

interface UserPayload {
  role: 'ADMINISTRATOR' | 'LECTURER' | 'STUDENT';
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");

    if (!accessToken) {
      router.replace("/books");
      return;
    }

    try {
      const decodedToken = jwtDecode<UserPayload>(accessToken);
      if (decodedToken.role !== 'ADMINISTRATOR') {
        router.replace("/books");
        return;
      }
      setIsAuthorized(true);
    } catch (error) {
      console.error("Invalid token, redirecting to login:", error);
      router.replace("/books");
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <FiLoader className="animate-spin text-4xl text-[#678D7D]" />
      </div>
    );
  }

  return <>{children}</>;
}