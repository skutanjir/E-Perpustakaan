import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'covers.openlibrary.org', // Sudah ada dari sebelumnya
      },
      {
        protocol: 'https',
        hostname: 'i.gr-assets.com',       // Sudah ada dari sebelumnya
      },
      {
        protocol: 'https',
        hostname: 'cdn.gramedia.com',      // Sudah ada dari sebelumnya
      },
      { // <-- TAMBAHKAN BLOK INI -->
        protocol: 'https',
        hostname: 'images.gr-assets.com', 
      },
    ],
  },
};

export default nextConfig;
