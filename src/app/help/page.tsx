"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-6">
          Bantuan & Dukungan
        </h1>
        <p className="text-center text-gray-700 mb-12">
          Jika Anda memerlukan bantuan, silakan hubungi kami melalui salah satu cara berikut:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Email */}
          <Link href="mailto:support@domain.com" className="flex items-center p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <EnvelopeIcon className="w-8 h-8 text-indigo-600 mr-4" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Email</h2>
              <p className="text-gray-600">support@domain.com</p>
            </div>
          </Link>

          {/* WhatsApp */}
          <Link href="https://wa.me/6281234567890" target="_blank" rel="noopener" className="flex items-center p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            {/* WhatsApp SVG */}
            <svg className="w-8 h-8 text-green-500 mr-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.67.15-.198.297-.768.967-.94 1.165-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.173.198-.297.298-.495.099-.198.05-.371-.025-.52-.075-.148-.67-1.612-.918-2.216-.242-.579-.487-.5-.67-.51l-.57-.01c-.198 0-.52.074-.792.371s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.693.626.712.227 1.36.195 1.872.118.57-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
              <path d="M12.005 2.003C6.476 2.003 2 6.48 2 12.009c0 2.118.554 4.096 1.519 5.8L2 22l4.344-1.426c1.652.9 3.56 1.387 5.66 1.387 5.529 0 10.005-4.476 10.005-10.005S17.534 2.003 12.005 2.003z"
              />
            </svg>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">WhatsApp</h2>
              <p className="text-gray-600">+62 812-3456-7890</p>
            </div>
          </Link>

          {/* Telepon */}
          <Link href="tel:+621234567890" className="flex items-center p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <PhoneIcon className="w-8 h-8 text-blue-600 mr-4" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Telepon</h2>
              <p className="text-gray-600">(021) 2345-6789</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
