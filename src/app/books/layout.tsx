// app/homepage/layout.tsx
import { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Homepage | E-Pustaka",
};

export default function MahasiswaLoginLayout({ children }: { children: ReactNode }) {
  // 1. Membaca cookie di sisi server
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");

  // 2. Memeriksa apakah accessToken ada
  if (!accessToken) {
    // 3. Jika tidak ada, redirect ke halaman login
    redirect("/auth/user/login");
  }

  // 4. Jika ada, tampilkan halaman
  return <>{children}</>;
}