"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/HeaderAdmin"; // Sesuaikan path jika perlu
import Sidebar from "@/components/sidebar";   // Sesuaikan path jika perlu
import {
  PhotoIcon,
  BookOpenIcon,
  UserIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  IdentificationIcon,
  TagIcon,
  ExclamationTriangleIcon, 
  CheckCircleIcon, 
} from "@heroicons/react/24/outline";
import CreatableSelect from "react-select/creatable";
import { motion, AnimatePresence } from "framer-motion"; 
import Image from "next/image"; 

export default function EditBukuPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null); 
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    if (!id) {
        showNotification("ID Buku tidak valid atau tidak ditemukan.", "error");
        setLoading(false);
        return;
    }

    async function fetchBook() {
      setLoading(true);
      setCoverPreview(null); // Reset cover preview sebelum fetch baru
      setCoverFile(null);
      try {
        // DATA DUMMY (Ganti dengan fetch API Anda)
        // Anda bisa mencoba mengganti coverUrl dengan link yang salah untuk mengetes onError
        const dummyBookData = {
          idFromDB: id as string, 
          judul: "Laskar Pelangi (Edisi Edit)",
          pengarang: "Andrea Hirata",
          penerbit: "Bentang Pustaka",
          tahun: "2005",
          idBuku: id as string, 
          kategori: "Fiksi, Roman",
          // Contoh URL yang mungkin valid: "https://images.gr-assets.com/books/1552399683l/1584282.jpg"
          // Contoh URL yang pasti GAGAL untuk tes: "https://example.com/gambar-tidak-ada.jpg"
          coverUrl: "https://images.gr-assets.com/books/1552399683l/1584282.jpg" 
        };
        await new Promise(resolve => setTimeout(resolve, 500));
        const data = dummyBookData; 
        // --- AKHIR DATA DUMMY ---

        setJudul(data.judul);
        setPengarang(data.pengarang);
        setPenerbit(data.penerbit);
        setTahun(data.tahun);
        setIdBuku(data.idBuku);
        setCoverPreview(data.coverUrl || null); 
        
        if (data.kategori) {
          const loadedKategori = data.kategori.split(',').map((k: string) => {
            const trimmedK = k.trim();
            return { label: trimmedK, value: trimmedK };
          });
          setKategori(loadedKategori);
        }

      } catch (err: any) {
        showNotification(`Gagal memuat data buku: ${err.message || "Kesalahan server."}`, "error");
      }
      setLoading(false);
    }

    fetchBook();
  }, [id]); 

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
    if (!judul || !pengarang || !penerbit || !tahun || !idBuku ) {
        showNotification("Semua field (Judul, Pengarang, Penerbit, Tahun, ID Buku) wajib diisi.", "error");
        return;
    }
    if (kategori.length === 0) {
        showNotification("Kategori wajib diisi. Pilih atau buat minimal satu kategori.", "error");
        return;
    }

    const kategoriStr = kategori.map((k) => k.value).join(", ");
    const payload = {
      judul,
      pengarang,
      penerbit,
      tahun,
      idBuku,
      kategori: kategoriStr,
    };
    showNotification("Data buku berhasil diperbarui!", "success");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex items-center justify-center p-6 min-h-[calc(100vh-4rem)]">
                <p className="text-xl font-semibold text-gray-700">Memuat data buku...</p>
            </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl text-black font-bold text-center mb-8">
            Form Edit Buku
          </h1>
          <form
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
          >
            <div className="flex flex-col items-center space-y-6">
              <label className="w-full max-w-xs sm:w-64 aspect-[3/4] border-2 border-gray-300 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition bg-gray-100">
                {coverFile ? (
                  <img
                    src={URL.createObjectURL(coverFile)}
                    alt="Cover Preview Baru"
                    className="object-contain w-full h-full rounded-lg p-1"
                  />
                ) : coverPreview ? (
                   <Image 
                    src={coverPreview}
                    alt={judul || "Cover Lama"} // Gunakan judul buku sebagai alt
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain rounded-lg p-1"
                    // --- TAMBAHKAN onError HANDLER ---
                    onError={() => {
                      // Jika gambar gagal dimuat, hapus URL preview
                      // Ini akan memicu tampilan placeholder "No Image"
                      setCoverPreview(null); 
                      showNotification("Gagal memuat gambar cover dari link yang ada.", "error");
                    }}
                  />
                ) : (
                  <div className="text-gray-500 flex flex-col items-center text-center p-4">
                    <PhotoIcon className="w-16 h-16 mb-2 opacity-50" />
                    <span className="font-semibold">No Image</span>
                    <span className="text-xs mt-1">Upload cover baru</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setCoverFile(e.target.files[0]);
                      setCoverPreview(null); 
                    }
                  }}
                />
              </label>
            </div>

            <div className="flex flex-col space-y-4">
              {[
                { icon: BookOpenIcon, value: judul, setter: setJudul, placeholder: "Judul Buku" },
                { icon: UserIcon, value: pengarang, setter: setPengarang, placeholder: "Pengarang" },
                { icon: BuildingOfficeIcon, value: penerbit, setter: setPenerbit, placeholder: "Penerbit" },
                { icon: CalendarIcon, value: tahun, setter: setTahun, placeholder: "Tahun Terbit" },
                { icon: IdentificationIcon, value: idBuku, setter: setIdBuku, placeholder: "ID Buku / ISBN (tidak dapat diubah)" , disabled: true },
              ].map(({ icon: Icon, value, setter, placeholder, disabled }) => (
                <div key={placeholder} className={`flex items-center rounded-lg px-4 py-3 ${disabled ? 'bg-gray-100' : 'bg-gray-200'}`}>
                  <Icon className="w-6 h-6 text-gray-500 mr-3" />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => !disabled && setter(e.target.value)}
                    placeholder={placeholder}
                    className="bg-transparent focus:outline-none w-full text-gray-800"
                    disabled={disabled}
                  />
                </div>
              ))}
              
              <div className="flex items-center text-black bg-gray-200 rounded-lg px-4 py-2">
                <TagIcon className="w-6 h-6 text-gray-500 mr-3 flex-shrink-0" />
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
                    styles={{ control: (base) => ({...base, backgroundColor: "transparent", border: "none", boxShadow: "none", minHeight: "unset"}), valueContainer: (base) => ({ ...base, padding: 0 }), input: (base) => ({ ...base, color: "#1f2937" }), multiValue: (base) => ({ ...base, backgroundColor: "#678D7D", borderRadius: "4px" }), multiValueLabel: (base) => ({ ...base, color: "white", fontWeight: 500 }), placeholder: (base) => ({ ...base, color: "#6b7280" }), }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition self-start font-semibold shadow-sm"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </main>
      </div>

      <AnimatePresence>
        {showNotificationModal && (
          <motion.div
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
    </div>
  );
}