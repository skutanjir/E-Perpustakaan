"use client";

import React, { useState, useEffect, JSX } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";
import {
  BookOpenIcon,
  IdentificationIcon,
  CalendarDaysIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import QRCode from "qrcode";
import { post, ApiErrorResponse } from "@/lib/api/apiService"; 

interface FormState {
  idBuku: string;
  nrp: string;
  tanggalPinjam: string;
  tanggalKembali: string;
}

interface BorrowSuccessResponse {
  data: {
    id: number | string; 
    bookId: string;      
    title: string;
    borrowDate: string;
    returnDate: string;
    name: string;
    userId: string;
  };
}

export default function BorrowingFormPage(): JSX.Element {
  const router = useRouter();
  const params = useParams();
  const bookIsbnFromParams = params.id as string;

  const [form, setForm] = useState<FormState>({
    idBuku: "",
    nrp: "",
    tanggalPinjam: "",
    tanggalKembali: "",
  });

  const [initialAlert, setInitialAlert] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [minTanggalKembali, setMinTanggalKembali] = React.useState("");

  useEffect(() => {
    if (bookIsbnFromParams) {
      setForm((prev) => ({ ...prev, idBuku: bookIsbnFromParams }));
    }
  }, [bookIsbnFromParams]);

  useEffect(() => {
    const now = new Date();
    const pad = (num: number) => num.toString().padStart(2, "0");
    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    setForm(prev => ({ ...prev, tanggalPinjam: formattedDateTime }));
    setMinTanggalKembali(formattedDateTime);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInitialAlert(false);

    const requestBody = {
      bookId: form.idBuku,
      userId: form.nrp, 
      borrowDate: new Date(form.tanggalPinjam).toISOString(),
      returnDate: new Date(form.tanggalKembali).toISOString(),
    };

    try {
      const responseAPI = await post<BorrowSuccessResponse>('/borrowings', requestBody);
      
      if (responseAPI && responseAPI.data && responseAPI.data.id !== undefined) {
        const idTransaksiPeminjaman = responseAPI.data.id.toString();
        
        const qrUrl = await QRCode.toDataURL(idTransaksiPeminjaman, {
          width: 250,
          margin: 2,
          type: 'image/png'
        });
        setQrCodeDataUrl(qrUrl);

        const link = document.createElement('a');
        link.href = qrUrl;
        link.download = `qrcode-peminjaman-${idTransaksiPeminjaman}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setShowSuccessModal(true);
      } else {
        throw new Error("Respons API tidak mengembalikan ID peminjaman ('id') yang valid.");
      }
    } catch (error) {
      const apiError = error as ApiErrorResponse; 
      let displayMessage = "Terjadi kesalahan yang tidak diketahui.";
      const errorMessageString = apiError.message || (typeof apiError.error === 'string' ? apiError.error : "");
      
      if (errorMessageString.toLowerCase().includes("sedang dipinjam") || 
          errorMessageString.toLowerCase().includes("unavailable") ||
          errorMessageString.toLowerCase().includes("already borrowed")) {
        displayMessage = "Mohon maaf, buku ini sedang dipakai orang lain.";
      } else if (errorMessageString) {
        displayMessage = errorMessageString;
      }
      
      setErrorMessage(displayMessage);
      setShowErrorModal(true);
    }
  };

  return (
    <>
      <Header id={"id mahasiswa"} />
      <main className="bg-gray-50 min-h-screen flex items-start justify-center px-4 pt-16 md:pt-24 pb-10 overflow-y-auto">
        <div className="w-full max-w-3xl">
          {initialAlert && (
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
                  ID Buku (ISBN)
                </label>
                <BookOpenIcon className="absolute left-3 top-10 w-5 h-5 text-gray-400" />
                <input
                  id="idBuku"
                  name="idBuku"
                  type="text"
                  value={form.idBuku}
                  required
                  disabled
                  className="w-full bg-gray-200 text-gray-500 border border-gray-300 rounded-full pl-12 pr-4 py-3 focus:outline-none cursor-not-allowed"
                />
              </div>

              <div className="relative">
                <label htmlFor="nrp" className="block text-sm font-medium text-gray-700 mb-2">
                  NRP / NIDN
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
                    required
                    disabled 
                    className="w-full bg-gray-200 text-gray-500 border border-gray-300 rounded-full pl-12 pr-4 py-3 focus:outline-none cursor-not-allowed"
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

      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-6 max-w-md w-full"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <CheckCircleIcon className="h-20 w-20 text-green-500" />
              <p className="text-2xl font-bold text-gray-800 text-center">Peminjaman Berhasil!</p>
              <p className="text-gray-600 text-center">Kode QR sudah otomatis diunduh. Anda juga bisa melihatnya di bawah ini.</p>
              {qrCodeDataUrl && <img src={qrCodeDataUrl} alt="QR Code Peminjaman" className="rounded-lg border border-gray-300 p-1" style={{maxWidth: '250px'}} />}
              
              <div className="w-full space-y-3 mt-4">
                <button
                  onClick={() => router.push('/books')}
                  className="w-full bg-blue-600 text-white rounded-full px-8 py-3 text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Kembali ke Daftar Buku
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showErrorModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-6 max-w-md w-full"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <ExclamationCircleIcon className="h-20 w-20 text-red-500" />
              <p className="text-2xl font-bold text-gray-800 text-center">Peminjaman Gagal</p>
              <p className="text-gray-600 text-center">{errorMessage}</p>
              <button
                onClick={() => router.push('/books')}
                className="w-full mt-4 bg-red-600 text-white rounded-full px-8 py-3 text-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Kembali ke Daftar Buku
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}