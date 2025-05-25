import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'quepkekdtbfvaqfknrqz.supabase.co', // Domain Supabase Anda
      'lh3.googleusercontent.com', // Contoh domain lain yang biasa digunakan
      'avatars.githubusercontent.com', // Contoh domain lain
      'uccqapoyhhmbmnojsqly.supabase.co'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'quepkekdtbfvaqfknrqz.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Konfigurasi lainnya bisa ditambahkan di sini
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true, // Jika menggunakan App Router
  },
};

export default nextConfig;