// app/page.tsx
"use client";

import React, {useState, useEffect, JSX} from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import {
  BookOpenIcon,
  IdentificationIcon,
  CalendarDaysIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";

interface FormState {
  idBuku: string;
  nrp: string;
  tanggalPinjam: string;
  tanggalKembali: string;
}

export default function Page(): JSX.Element {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    idBuku: "",
    nrp: "",
    tanggalPinjam: "",
    tanggalKembali: "",
  });
  const [showAlert, setShowAlert] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [minTanggalKembali, setMinTanggalKembali] = React.useState("");

React.useEffect(() => {
  const now = new Date();
  const pad = (num: number) => num.toString().padStart(2, "0");
  const formatted = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  setMinTanggalKembali(formatted);
}, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowAlert(false);
    setShowModal(true);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showModal) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push('/beranda');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showModal, router]);

  return (
    <>
      <Header id={"id mahasiswa"} />
      <main className="bg-gray-50 min-h-screen flex items-start justify-center px-4 pt-16 md:pt-24 pb-10 overflow-y-auto">
        <div className="w-full max-w-3xl">
          {showAlert && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6 flex items-center"
              role="alert"
            >
              <ExclamationCircleIcon className="h-6 w-6 text-red-500 mr-2" />
              <span className="text-sm">
                Silahkan periksa kembali data di atas, pastikan sudah benar sebelum meminjam buku.
              </span>
            </div>
          )}

          <div className="bg-white border-2 border-gray-300 rounded-xl p-10 sm:p-16 shadow-xl">
            <h2 className="text-3xl font-semibold text-center mb-10 text-black">
              Form Peminjaman Buku
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="relative">
                <label htmlFor="idBuku" className="block text-sm font-medium text-gray-700 mb-2">
                  ID Buku
                </label>
                <BookOpenIcon className="absolute left-3 top-10 w-5 h-5 text-gray-400" />
                <input
                  id="idBuku"
                  name="idBuku"
                  type="text"
                  value={form.idBuku}
                  onChange={handleChange}
                  required
                  className="w-full bg-white text-black border border-gray-300 rounded-full pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div className="relative">
                <label htmlFor="nrp" className="block text-sm font-medium text-gray-700 mb-2">
                  NRP
                </label>
                <IdentificationIcon className="absolute left-3 top-10 w-5 h-5 text-gray-400" />
                <input
                
                  id="nrp"
                  name="nrp"
                  type="text"
                  value={form.nrp}
                  onChange={handleChange}
                  required
                  className="w-full bg-white text-black border border-gray-300 rounded-full pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative">
                  <label htmlFor="tanggalPinjam" className="block text-sm font-medium text-gray-700 mb-2">
                    Waktu Peminjaman
                  </label>
                  <CalendarDaysIcon className="absolute left-3 top-10 w-5 h-5 text-gray-400" />
                  <input
                    id="tanggalPinjam"
                    name="tanggalPinjam"
                    type="datetime-local"
                    value={form.tanggalPinjam}
                    onChange={handleChange}
                    required
                    className="w-full bg-white text-black border border-gray-300 rounded-full pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div className="relative">
                  <label htmlFor="tanggalKembali" className="block text-sm font-medium text-gray-700 mb-2">
                    Waktu Pengembalian
                  </label>
                  <CalendarDaysIcon className="absolute left-3 top-10 w-5 h-5 text-gray-400" />
                  <input
                    id="tanggalKembali"
                    name="tanggalKembali"
                    type="datetime-local"
                    value={form.tanggalKembali}
                    min={minTanggalKembali}
                    onChange={handleChange}
                    required
                    className="w-full bg-white text-black border border-gray-300 rounded-full pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="mt-6 bg-blue-600 text-white rounded-full px-10 py-4 text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Pinjam
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Modal Success */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-blur-md flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-16 flex flex-col items-center space-y-8 max-w-lg w-full"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <CheckCircleIcon className="h-24 w-24 text-green-500" />
              <p className="text-2xl font-semibold text-gray-800">Peminjaman Sukses!</p>
              <p className="text-gray-600">Redirect in {countdown}...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
