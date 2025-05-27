# ✨ E-Perpustakaan

[![Next.js](https://img.shields.io/badge/Next.js-black?style=flat-square\&logo=next.js\&logoColor=white)](https://nextjs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat-square\&logo=typescript)](https://www.typescriptlang.org/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-skyblue?style=flat-square\&logo=tailwind-css)](https://tailwindcss.com/) [![MIT License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)

**E-Perpustakaan** adalah aplikasi perpustakaan digital dengan tampilan minimalis, dirancang untuk memudahkan pengelolaan data buku, kategori, dan penulis.

---

## 🚀 Fitur Utama

* 🗂️ **Sidebar Minimalis Adaptif**

  * 📚 Tambah Buku
  * 📂 Tambah Kategori
  * ✍️ Tambah Author
  * Menyembunyikan label saat kolaps dan menampilkan ikon + label saat diperluas.
* 🖋️ **Form Input Interaktif** untuk menambahkan data dengan validasi sederhana.
* 📊 **Tabel Data** dengan opsi edit dan hapus setiap entri.
* 🌐 **Responsif**: tampilan optimal di desktop, tablet, dan mobile.
* ⚙️ **Pengelolaan CRUD** lengkap untuk Books, Categories, dan Authors.

---

## 🛠️ Teknologi

| Teknologi                                                                                                              | Deskripsi                                        |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| ![Next.js](https://img.shields.io/badge/Next.js-black?style=flat-square\&logo=next.js\&logoColor=white) Next.js        | Server-side rendering dan static site generation |
| ![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat-square\&logo=typescript) TypeScript              | Pengetikan statis untuk kode yang lebih aman     |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-skyblue?style=flat-square\&logo=tailwind-css) Tailwind CSS | Utility-first CSS untuk styling konsisten        |
| ![React Icons](https://img.shields.io/badge/React_Icons-informational?style=flat-square\&logo=react) React Icons       | Library ikon untuk elemen UI                     |

---

## ⚙️ Instalasi

```bash
# Clone repository
git clone https://github.com/skutanjir/E-Perpustakaan.git
cd E-Perpustakaan

# Install dependensi
npm install

# Jalankan mode development
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

---

## 🗃️ Struktur Proyek

```
E-Perpustakaan/
├─ public/           # Asset statis (gambar, favicon)
├─ src/
│  ├─ app/           # Halaman dan routing Next.js
│  ├─ components/    # UI Components (Sidebar, Form, Table)
│  └─ styles/        # File Tailwind/Custom CSS
├─ .eslintrc.js      # Konfigurasi linting
├─ next.config.js    # Konfigurasi Next.js
├─ tailwind.config.js# Konfigurasi Tailwind CSS
├─ tsconfig.json     # Konfigurasi TypeScript
└─ package.json      # Script dan dependensi
```

---

## 🤝 Kontribusi

Perbaikan bug dan fitur baru diterima dengan senang hati:

1. Buat issue untuk diskusi fitur besar.
2. Fork repository ini.
3. Buat branch: `git checkout -b fitur-baru`.
4. Commit perubahan: `git commit -m "Menambahkan fitur X"`.
5. Push ke branch: `git push origin fitur-baru`.
6. Buat Pull Request di GitHub.

---

## 📜 Lisensi

Proyek dilisensikan di bawah **MIT License**. Lihat [LICENSE](./LICENSE) untuk detail.

---

© 2025 E-Perpustakaan Team. Semua hak dilindungi hak cipta.
