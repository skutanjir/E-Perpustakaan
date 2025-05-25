"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const NAV_ITEMS = ["Home", "Services", "Contact", "About"];
const SERVICES = [
  { title: "Peminjaman Online", desc: "Pinjam buku dari mana saja, kapan saja melalui aplikasi E-Pustaka." },
  { title: "Pengembalian Offline", desc: "Kembalikan buku secara langsung di lokasi perpustakaan terdekat." },
  { title: "Pengingat Jatuh Tempo", desc: "Dapatkan notifikasi sebelum waktu pengembalian tiba." },
];
const RECOMMENDATIONS = [
  { title: "Seni Hidup Minimalis", author: "Francine Jay" },
  { title: "Filosofi Teras", author: "Henry Menampiring" },
  { title: "Selamat Tinggal", author: "Tere Liye" },
];
const TEAM = [
  { name: "Jane Doe", role: "CEO & Founder", img: "/team1.jpg" },
  { name: "John Smith", role: "CTO", img: "/team2.jpg" },
  { name: "Alice Johnson", role: "Lead Designer", img: "/team3.jpg" },
];

export default function Home(): JSX.Element {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileRegisterOpen, setMobileRegisterOpen] = useState(false);
  const [mobileLoginOpen, setMobileLoginOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const headerClasses = scrolled
    ? 'fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-md transition py-4'
    : 'fixed top-0 left-0 w-full bg-transparent transition py-6';
  const linkClasses = scrolled ? 'text-gray-800' : 'text-white';

  return (
    <div className="overflow-x-hidden">
      {/* Navbar */}
      <header className={`${headerClasses} px-6 sm:px-12 lg:px-16 flex items-center justify-between z-50`}>
        <Image src="/logo1.png" alt="Logo" width={160} height={160} />
        <nav className="hidden md:flex space-x-8">
          {NAV_ITEMS.map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className={`${linkClasses} hover:text-green-600 font-medium transition`}
            >
              {item}
            </a>
          ))}
        </nav>
        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="relative group">
            <button className={`${scrolled ? 'bg-green-100 text-green-800' : 'bg-white text-gray-800'} px-5 py-2 rounded-lg font-medium transition`}>Daftar</button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition">
              <a href="/daftar/mahasiswa" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Mahasiswa</a>
            </div>
          </div>
          <div className="relative group">
            <button className={`${scrolled ? 'bg-green-700 text-white' : 'bg-green-600 text-white'} px-5 py-2 rounded-lg font-medium transition`}>Masuk</button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition">
              <a href="/login/mahasiswa" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Mahasiswa</a>
              <a href="/login/admin" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Admin</a>
            </div>
          </div>
        </div>
        {/* Mobile Hamburger */}
        <button className={`${linkClasses} md:hidden focus:outline-none`} onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-label="Toggle menu">
          {mobileNavOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>
      {/* Mobile Nav */}
      {mobileNavOpen && (
        <nav className="md:hidden fixed top-[4.5rem] left-0 w-full bg-white shadow-lg z-40">
          <div className="flex flex-col p-6 space-y-4">
            {NAV_ITEMS.map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="py-2 text-lg text-gray-800 hover:bg-gray-100 rounded transition">{item}</a>
            ))}
            <div>
              <button onClick={() => setMobileRegisterOpen(!mobileRegisterOpen)} className="w-full text-left py-2 text-lg text-gray-800 hover:bg-gray-100 rounded transition">Daftar</button>
              {mobileRegisterOpen && (
                <div className="pl-4">
                  <a href="/daftar/mahasiswa" className="block py-2 text-gray-700 hover:bg-gray-100 rounded transition">Mahasiswa</a>
                </div>
              )}
            </div>
            <div>
              <button onClick={() => setMobileLoginOpen(!mobileLoginOpen)} className="w-full text-left py-2 text-lg text-gray-800 hover:bg-gray-100 rounded transition">Masuk</button>
              {mobileLoginOpen && (
                <div className="pl-4">
                  <a href="/login/mahasiswa" className="block py-2 text-gray-700 hover:bg-gray-100 rounded transition">Mahasiswa</a>
                  <a href="/login/admin" className="block py-2 text-gray-700 hover:bg-gray-100 rounded transition">Admin</a>
                </div>
              )}
            </div>
          </div>
        </nav>
      )}

      {/* Hero */}
      <main className="relative flex flex-col-reverse md:flex-row items-center justify-center min-h-screen pt-24 md:pt-32 bg-gradient-to-br from-indigo-900 to-gray-200 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-gray-200/30 rounded-full mix-blend-lighten" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gray-200/30 rounded-full mix-blend-lighten" />
        <div className="md:w-1/2 text-center md:text-left px-6 lg:px-16">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
            Melayani Peminjaman Buku<br />Secara Online ataupun Offline
          </h1>
          <p className="mt-6 text-xl text-gray-200">E-Pustaka hadir untuk mempermudah proses peminjaman buku baik secara daring maupun luring.</p>
          <div className="mt-8 relative w-full sm:w-2/3 lg:w-1/2 mx-auto md:mx-0">
            <MagnifyingGlassIcon className="absolute w-6 h-6 text-white left-5 top-1/2 transform -translate-y-1/2 z-10" />
            <input
              type="text"
              placeholder="Cari judul buku..."
              className="w-full pl-12 pr-6 py-4 rounded-full bg-white/30 backdrop-blur-sm placeholder-white text-white text-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center px-6 lg:px-16 mb-10 md:mb-0">
          <Image
            src="/logohomes.png"
            alt="Ilustrasi baca buku"
            width={600}
            height={500}
            priority
            className="max-w-full h-auto"
          />
        </div>
      </main>

      {/* Services */}
      <section id="services" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <h2 className="text-4xl font-bold text-gray-800 text-center">Layanan Kami</h2>
          <p className="mt-6 text-center text-gray-600 text-lg">Solusi lengkap untuk kebutuhan perpustakaan digital dan fisik.</p>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {SERVICES.map(({ title, desc }) => (
              <div key={title} className="p-8 bg-indigo-50 rounded-3xl shadow-xl">
                <h3 className="text-2xl font-semibold text-indigo-700">{title}</h3>
                <p className="mt-4 text-gray-600 text-base">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <h2 className="text-4xl font-bold text-gray-800 text-center">Hubungi Kami</h2>
          <p className="mt-6 text-center text-gray-600 text-lg">Kirim pesan, saran, atau pertanyaan melalui formulir berikut.</p>
          <form className="mt-12 max-w-2xl mx-auto space-y-8">
            <input type="text" placeholder="Nama Lengkap" className="w-full px-6 py-4 text-black bg-gray-100 rounded-full placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-300 text-lg" />
            <input type="email" placeholder="Email" className="w-full px-6 py-4 text-black bg-gray-100 rounded-full placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-300 text-lg" />
            <textarea rows={5} placeholder="Pesan Anda" className="w-full px-6 py-4 text-black bg-gray-100 rounded-3xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-300 text-lg"></textarea>
            <button type="submit" className="w-full py-4 bg-green-700 text-white rounded-full hover:bg-green-800 transition text-lg font-medium">Kirim Pesan</button>
          </form>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 text-center">
          <h2 className="text-4xl font-bold text-gray-800">Tentang E-Pustaka</h2>
          <p className="mt-6 text-gray-600 text-lg">E-Pustaka didirikan untuk memodernisasi cara orang mengakses dan meminjam buku. Visi kami adalah menciptakan ekosistem perpustakaan yang inklusif dan mudah dijangkau oleh siapa saja.</p>
          <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-12">
            {TEAM.map(({ name, role, img }) => (
              <div key={name} className="flex flex-col items-center">
                <Image src={img} alt={name} width={120} height={120} className="rounded-full shadow-lg" />
                <p className="mt-4 text-gray-700 font-semibold text-xl">{name}</p>
                <p className="text-gray-500 text-base">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
