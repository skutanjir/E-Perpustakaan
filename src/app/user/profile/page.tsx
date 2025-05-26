"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Image from "next/image";

export default function Page() {
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState<string>("Nama Mahasiswa");
  const [email, setEmail] = useState<string>("email@example.com");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log({ id, name, email, imageFile });
    alert("Profil berhasil disimpan!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex items-center justify-center">
      <div className="absolute top-0 left-0 w-full">
        <Header />
      </div>
      <main className="bg-white shadow-2xl rounded-3xl p-8 max-w-md w-full mx-4">
        <h1 className="text-3xl font-semibold text-gray-900 mb-4 text-center">
          Profile Mahasiswa
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center mb-6">
            <div className="relative w-28 h-28">
              <div className="w-full h-full border-4 border-indigo-200 rounded-full overflow-hidden shadow-inner">
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Preview Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-indigo-300 text-lg font-semibold">
                    No Image
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 rounded-full p-2 cursor-pointer shadow-lg">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-600">Nama</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 font-medium shadow-lg transition"
            >
              Simpan
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
