// app/admin/tambah-buku/page.tsx

"use client";

import React, { useState } from "react";
import Header from "../../components/HeaderAdmin";
import Sidebar from "../../components/sidebar";
import {
  PhotoIcon,
  DocumentChartBarIcon,
  BookOpenIcon,
  UserIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  IdentificationIcon,
  TagIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import CreatableSelect from "react-select/creatable";
import { motion, AnimatePresence } from "framer-motion";

export default function TambahBukuPage() {
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [scannedCode, setScannedCode] = useState<string>("");
  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [judul, setJudul] = useState("");
  const [pengarang, setPengarang] = useState("");
  const [penerbit, setPenerbit] = useState("");
  const [tahun, setTahun] = useState("");
  const [idBuku, setIdBuku] = useState("");
  const [kategori, setKategori] = useState<{ label: string; value: string }[]>([]);

  const [kategoriOptions, setKategoriOptions] = useState([
    { value: "Teknologi", label: "Teknologi" },
    { value: "Agama", label: "Agama" },
    { value: "Sejarah", label: "Sejarah" },
    { value: "Fiksi", label: "Fiksi" },
    { value: "Non-Fiksi", label: "Non-Fiksi" },
    { value: "Sains", label: "Sains" },
  ]);

  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<"success" | "error">("error");

  const showNotification = (message: string, type: "success" | "error") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotificationModal(true);
  };

  function subjectsToOptions(subjects: any[]) {
    if (!subjects) return [];
    return subjects.map((s) => ({ label: s.name || s, value: s.name || s }));
  }

  async function fetchByISBN(isbn: string) {
    setLoading(true);
    setCoverFile(null);

    try {
      const detailsRes = await fetch(
        `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=details&format=json`
      );
      if (!detailsRes.ok) {
        throw new Error(`Gagal mengambil detail buku (status: ${detailsRes.status})`);
      }
      const detailsData = await detailsRes.json();
      const details = detailsData[`ISBN:${isbn}`]?.details;

      if (details) {
        setJudul(details.title || "");
        setPengarang(details.authors?.map((a: any) => a.name).join(", ") || "");
        setPenerbit(details.publishers?.map((p: any) => p.name).join(", ") || "");
        setTahun(details.publish_date || "");
        const opts = subjectsToOptions(details.subjects?.slice(0, 10) || []);
        setKategori(opts);

        const coverUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
        const coverRes = await fetch(coverUrl);

        if (coverRes.ok && !coverRes.url.includes('placeholder')) {
          const imageBlob = await coverRes.blob();
          const imageFile = new File([imageBlob], `${isbn}.jpg`, { type: imageBlob.type });
          setCoverFile(imageFile);
        }
      } else {
        showNotification("Data buku tidak ditemukan di OpenLibrary untuk ISBN ini.", "error");
      }
    } catch (err: any) {
      showNotification(`Gagal mengambil data buku: ${err.message || "Terjadi kesalahan jaringan."}`, "error");
    }
    setLoading(false);
  }

  function handleScanResult(code: string) {
    setScannedCode(code);
    if (/^\d{10,13}$/.test(code)) {
      setIdBuku(code);
      fetchByISBN(code);
    } else {
      setIdBuku(code);
      showNotification("Format kode yang discan bukan ISBN standar (10-13 digit angka). ID Buku tetap disimpan.", "error");
    }
    setShowScanner(false);
  }

  function handleKategoriChange(selected: any) {
    setKategori(selected || []);
  }

  const handleCreateKategori = (inputValue: string) => {
    setIsCreating(true);
    setTimeout(() => {
      const newOption = { label: inputValue, value: inputValue };
      setKategoriOptions((prev) => [...prev, newOption]);
      setKategori((prev) => [...prev, newOption]);
      setIsCreating(false);
    }, 1000);
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!judul || !pengarang || !penerbit || !tahun || !idBuku) {
        showNotification("Semua field wajib diisi.", "error");
        return;
    }
    // --- VALIDASI KATEGORI WAJIB ---
    if (kategori.length === 0) {
        showNotification("Kategori wajib diisi. Pilih atau buat minimal satu kategori.", "error");
        return;
    }

    const kategoriStr = kategori.map((k) => k.value).join(", ");
    const payload = {
      coverFile,
      judul,
      pengarang,
      penerbit,
      tahun,
      idBuku,
      kategori: kategoriStr,
    };
    showNotification("Data buku berhasil disiapkan untuk dikirim!", "success");
    // console.log("DATA PAYLOAD:", payload); // Jika masih butuh untuk debug sementara
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-8">
          <h1 className="text-3xl text-black font-bold text-center mb-8">
            Form Tambah Buku
          </h1>
          <form
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Kolom Kiri: Upload Cover & Scan Barcode */}
            <div className="flex flex-col items-center space-y-6">
              <label className="w-64 h-96 border-2 border-gray-300 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition bg-gray-50">
                {coverFile ? (
                  <img
                    src={URL.createObjectURL(coverFile)}
                    alt="Cover Preview"
                    className="object-contain w-full h-full rounded-lg p-2"
                  />
                ) : (
                  <div className="text-gray-400 flex flex-col items-center p-4 text-center">
                    <PhotoIcon className="w-12 h-12 mb-2" />
                    <span>Upload Cover atau Scan Barcode</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setCoverFile(e.target.files[0]);
                    }
                  }}
                />
              </label>

              <button
                type="button"
                onClick={() => setShowScanner(true)}
                className="w-64 h-16 border-2 border-gray-300 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition bg-white"
              >
                <div className="text-gray-400 flex items-center">
                  <DocumentChartBarIcon className="w-6 h-6 mr-2" />
                  <span>Scan QR/barcode</span>
                </div>
              </button>

              {loading && (
                <p className="mt-4 text-gray-600 text-center font-semibold">
                  Mengambil data buku...
                </p>
              )}
            </div>

            {/* Kolom Kanan: Input Fields */}
            <div className="flex flex-col space-y-4">
              {[
                { icon: BookOpenIcon, value: judul, setter: setJudul, placeholder: "Judul Buku" },
                { icon: UserIcon, value: pengarang, setter: setPengarang, placeholder: "Pengarang" },
                { icon: BuildingOfficeIcon, value: penerbit, setter: setPenerbit, placeholder: "Penerbit" },
                { icon: CalendarIcon, value: tahun, setter: setTahun, placeholder: "Tahun Terbit" },
                { icon: IdentificationIcon, value: idBuku, setter: setIdBuku, placeholder: "ID Buku / ISBN" },
              ].map(({ icon: Icon, value, setter, placeholder }) => (
                <div key={placeholder} className="flex items-center bg-gray-200 rounded-lg px-4 py-3">
                  <Icon className="w-6 h-6 text-gray-500 mr-3" />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={placeholder}
                    className="bg-transparent focus:outline-none w-full text-gray-800"
                  />
                </div>
              ))}
              
               <div className="flex items-center text-black bg-gray-200 rounded-lg px-4 py-2">
                 <TagIcon className="w-6 h-6 text-gray-600 mr-3 flex-shrink-0" />
                 <div className="flex-1">
                   <CreatableSelect
                     isMulti
                     isClearable
                     isDisabled={isCreating}
                     isLoading={isCreating}
                     onChange={handleKategoriChange}
                     onCreateOption={handleCreateKategori}
                     options={kategoriOptions}
                     value={kategori}
                     placeholder="Pilih atau ketik kategori baru"
                     formatCreateLabel={(inputValue) => `Buat kategori "${inputValue}"`}
                     styles={{ control: (base) => ({ ...base, backgroundColor: "transparent", border: "none", boxShadow: "none", minHeight: "unset" }), valueContainer: (base) => ({ ...base, padding: 0 }), input: (base) => ({ ...base, color: "#1f2937" }), multiValue: (base) => ({ ...base, backgroundColor: "#678D7D", borderRadius: "4px" }), multiValueLabel: (base) => ({ ...base, color: "white", fontWeight: 500 }), placeholder: (base) => ({ ...base, color: "#6b7280" }), }}
                   />
                 </div>
               </div>

               <button type="submit" className="mt-4 bg-[#678D7D] text-white px-6 py-3 rounded-lg hover:bg-[#5a776d] transition self-start font-semibold">
                 Tambah Buku
               </button>
            </div>
          </form>

          {/* Modal Scanner */}
          {showScanner && (
            // --- Latar belakang modal scanner diubah ---
            <div className="fixed inset-0 bg-transparent bg-opacity-25 flex items-center justify-center z-50" onClick={() => setShowScanner(false)}>
              <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg text-black font-medium mb-4 text-center">Arahkan ke Barcode Buku</h3>
                <div className="h-64 rounded-md overflow-hidden flex items-center justify-center bg-transparent">
                  <BarcodeScannerComponent width={300} height={300} facingMode="environment" onUpdate={(err, result) => { if (result) { handleScanResult((result as any).getText()); } }} />
                </div>
                <button onClick={() => setShowScanner(false)} className="mt-4 w-full text-center py-2 text-red-600 font-semibold hover:bg-red-50 rounded-md transition">Tutup</button>
              </div>
            </div>
          )}

          {/* Modal Notifikasi (Error/Success) */}
          <AnimatePresence>
            {showNotificationModal && (
              <motion.div
                // --- Latar belakang modal notifikasi diubah ---
                className="fixed inset-0 bg-transparent bg-opacity-25 flex items-center justify-center z-[100]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowNotificationModal(false)}
              >
                <motion.div
                  className={`bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center mx-4
                    border-t-4 ${notificationType === 'error' ? 'border-red-500' : 'border-green-500'}`}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {notificationType === 'error' ? (
                    <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  ) : (
                    <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  )}
                  <h3 className={`text-xl font-semibold mb-3 ${notificationType === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                    {notificationType === 'error' ? 'Terjadi Kesalahan' : 'Berhasil!'}
                  </h3>
                  <p className="text-gray-700 mb-6">{notificationMessage}</p>
                  <button
                    onClick={() => setShowNotificationModal(false)}
                    className={`w-full px-4 py-2 rounded-lg text-white font-medium transition-colors
                      ${notificationType === 'error' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                  >
                    Tutup
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </main>
      </div>
    </div>
  );
}