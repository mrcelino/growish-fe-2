'use client';
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../context/auth";
import { useState } from "react";
import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar fixed top-0 left-0 w-full z-50 bg-[#80C978] p-4 md:px-20 shadow-sm flex items-center justify-between">
      <Info />

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-12">
        <Menu />
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <button onClick={toggleMenu}>
          {menuOpen ? <CloseIcon size={28} /> : <MenuIcon size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-[72px] left-0 w-full bg-[#80C978] flex flex-col items-start px-6 py-4 space-y-4 md:hidden">
          <Menu isMobile />
        </div>
      )}
    </nav>
  );
}

function Info() {
  return (
    <Link href="/dashboard" className="text-2xl font-bold text-black">
      LabGizi
    </Link>
  );
}

function Menu({ isMobile = false }: { isMobile?: boolean }) {
  const auth = useAuth();
  const logout = auth?.logout;

  const linkClass = "text-black font-semibold text-lg hover:text-[#326D2C] transition duration-300";

  return (
    <>
      <Link href="/dashboard" className={linkClass}>
        Beranda
      </Link>
      <Link href="/dashboard/bahan-pangan" className={linkClass}>
        Lihat Bahan
      </Link>
      <Link href="/dashboard/resep" className={linkClass}>
        Resep Saya
      </Link>
      <div className={`flex items-center ${isMobile ? "space-x-4 mt-4" : "space-x-6"}`}>
        <Image
          src="/user.png"
          alt="profile icon"
          width={40}
          height={40}
          className="rounded-full p-1 bg-gray-100"
        />
        <button
          onClick={logout}
          disabled={!logout}
          className="flex items-center justify-center p-2 size-10 bg-[#326D2C] rounded-xl cursor-pointer"
        >
          <Image src="/logout.png" alt="logout icon" width={20} height={20} />
        </button>
      </div>
    </>
  );
}
