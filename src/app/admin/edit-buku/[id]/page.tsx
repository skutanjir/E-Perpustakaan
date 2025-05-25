"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "../../../components/HeaderAdmin";
import Sidebar from "../../../components/sidebar";
import {
  PhotoIcon,
  DocumentChartBarIcon,
  BookOpenIcon,
  UserIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  IdentificationIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import Select from "react-select";

export default function EditBukuPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [scannedCode, setScannedCode] = useState<string>("");
  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading] = useState(false);

  const [judul, setJudul] = useState("");
  const [pengarang, setPengarang] = useState("");
  const [penerbit, setPenerbit] = useState("");
  const [tahun, setTahun] = useState("");
  const [idBuku, setIdBuku] = useState("");
  const [kategori, setKategori] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    async function fetchBook() {
      try {
        const res = await fetch(`/api/buku/${id}`);
        const data = await res.json();
        setJudul(data.judul);
        setPengarang(data.pengarang);
        setPenerbit(data.penerbit);
        setTahun(data.tahun);
        setIdBuku(data.idBuku);
        setKategori(
          data.kategori.split(",").map((k: string) => ({ label: k, value: k }))
        );
      } catch (err) {
        alert("Gagal memuat data buku.");
      }
    }
    fetchBook();
  }, [id]);

  const kategoriOptions = [
    { value: "Teknologi", label: "Teknologi" },
    { value: "Agama", label: "Agama" },
    { value: "Sejarah", label: "Sejarah" },
  ];

  function handleKategoriChange(selected: any) {
    setKategori(selected || []);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const kategoriStr = kategori.map(k => k.value).join(", ");

    const payload = {
      coverFile,
      scannedCode,
      judul,
      pengarang,
      penerbit,
      tahun,
      idBuku,
      kategori: kategoriStr,
    };

    console.log("Edit buku:", payload);
    alert("Data buku berhasil disiapkan untuk update.");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-8">
          <h1 className="text-3xl text-black font-bold text-center mb-8">
            Form Edit Buku
          </h1>
          <form
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="flex flex-col items-center space-y-6">
              <label className="w-64 h-64 border-2 border-gray-300 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition">
                {coverFile ? (
                  <img
                    src={URL.createObjectURL(coverFile)}
                    alt="Cover Preview"
                    className="object-cover w-full h-full rounded-lg"
                  />
                ) : (
                  <div className="text-gray-400 flex flex-col items-center">
                    <PhotoIcon className="w-12 h-12 mb-2" />
                    <span>Upload Cover Baru (opsional)</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files && setCoverFile(e.target.files[0])
                  }
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

            <div className="flex flex-col space-y-4">
              {[
                {
                  icon: BookOpenIcon,
                  value: judul,
                  setter: setJudul,
                  placeholder: "Judul Buku",
                  type: "text",
                },
                {
                  icon: UserIcon,
                  value: pengarang,
                  setter: setPengarang,
                  placeholder: "Pengarang",
                  type: "text",
                },
                {
                  icon: BuildingOfficeIcon,
                  value: penerbit,
                  setter: setPenerbit,
                  placeholder: "Penerbit",
                  type: "text",
                },
                {
                  icon: CalendarIcon,
                  value: tahun,
                  setter: setTahun,
                  placeholder: "Tahun Terbit",
                  type: "text",
                },
                {
                  icon: IdentificationIcon,
                  value: idBuku,
                  setter: setIdBuku,
                  placeholder: "ID Buku",
                  type: "text",
                },
              ].map(({ icon: Icon, value, setter, placeholder, type }) => (
                <div
                  key={placeholder}
                  className="flex items-center bg-gray-200 rounded-lg px-4 py-2"
                >
                  <Icon className="w-6 h-6 text-gray-600 mr-3" />
                  <input
                    type={type}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={placeholder}
                    className="bg-transparent focus:outline-none w-full text-gray-700"
                    required
                  />
                </div>
              ))}

              <div className="flex items-center bg-gray-200 rounded-lg px-4 py-2">
                <TagIcon className="w-6 h-6 text-gray-600 mr-3" />
                <div className="flex-1">
                  <Select
                    isMulti
                    value={kategori}
                    onChange={handleKategoriChange}
                    options={kategoriOptions}
                    placeholder="Pilih kategori (bisa lebih dari satu)"
                    className="react-select-container text-black"
                    classNamePrefix="react-select"
                    components={{
                      DropdownIndicator: () => null,
                      IndicatorSeparator: () => null,
                    }}
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: "transparent",
                        border: "none",
                        boxShadow: "none",
                        minHeight: "unset",
                      }),
                      valueContainer: (base) => ({
                        ...base,
                        padding: 0,
                      }),
                      input: (base) => ({
                        ...base,
                        color: "#000",
                      }),
                      multiValue: (base) => ({
                        ...base,
                        backgroundColor: "#678D7D",
                        borderRadius: "9999px",
                        paddingLeft: 8,
                        paddingRight: 8,
                        color: "white",
                      }),
                      multiValueLabel: (base) => ({
                        ...base,
                        color: "white",
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "#9CA3AF",
                      }),
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-4 bg-[#678D7D] text-white px-6 py-2 rounded-full hover:bg-[#5a776d] transition self-start"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>

          {showScanner && (
            <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-80">
                <h3 className="text-lg text-black font-medium mb-4">
                  Scan QR/barcode
                </h3>
                <div className="h-64 flex items-center justify-center">
                  <BarcodeScannerComponent
                    width={300}
                    height={300}
                    facingMode="environment"
                    onUpdate={(err: any, result: any) => {
                      if (result) {
                        setScannedCode(result.getText());
                        setIdBuku(result.getText());
                      }
                      if (err) console.error(err);
                    }}
                  />
                </div>
                <button
                  onClick={() => setShowScanner(false)}
                  className="mt-4 w-full text-center text-red-600"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}