"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import DashboardLayout from "@/app/layout/DashboardLayout";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/app/context/auth";

interface Material {
  id: string;
  name: string;
  calories: number;
  protein: number;
  categories: string[];
}

export default function Page() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // Mapping kategori dari label ke value API
  const categoryMap: Record<string, string> = {
    Semua: "all",
    Diet: "diet",
    Otot: "muscle",
    Jantung: "heart",
    Diabetes: "diabetes",
  };

  // Ambil data bahan pangan
  useEffect(() => {
    if (!user?.token) return;

    const fetchMaterials = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await res.json();
        setMaterials(data.data || []);
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
    };

    fetchMaterials();
  }, [user]);

  const filteredMaterials = materials.filter((mat) => {
    const matchesSearch = mat.name.toLowerCase().includes(searchTerm.toLowerCase());
    const selected = categoryMap[selectedCategory];
    const matchesCategory =
      selected === "all" || (mat.categories || []).includes(selected);
    return matchesSearch && matchesCategory;
  });

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const categories = ["Semua", "Diet", "Otot", "Jantung", "Diabetes"];

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-semibold text-black">Riwayat Bahan Pangan</h2>

      {/* Kategori */}
      <div className="flex mt-6 space-x-5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`border-[3px] border-[#80C978] rounded-2xl py-2 px-5 text-xl font-semibold flex items-center justify-center shadow-md transition-colors hover:scale-105 cursor-pointer duration-300 ${
              selectedCategory === cat ? "bg-[#80C978] text-white" : "bg-white text-black"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search & Tambah */}
      <div className="flex gap-5 mt-8">
        <div className="flex bg-white items-center space-x-4 border-[#BFBFBF] border-2 py-4 px-4 font-medium text-lg rounded-2xl w-3/4">
          <Image src="/search.png" alt="search icon" width={30} height={30} />
          <input
            type="text"
            placeholder="Cari Bahan Pangan"
            className="w-full placeholder-black outline-0"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex items-center justify-center bg-[#80C978] rounded-2xl py-3 px-4 font-medium text-lg w-1/4">
          <Link href="/dashboard/tambah" className="font-semibold text-xl">
            + Tambah Bahan Pangan
          </Link>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-5 gap-10 mt-6">
        {filteredMaterials.length > 0 ? (
          filteredMaterials.map((mat) => <Card key={mat.id} material={mat} />)
        ) : (
          <p className="col-span-5 text-center text-gray-500">Bahan pangan tidak ditemukan</p>
        )}
      </div>
    </DashboardLayout>
  );
}

interface CardProps {
  material: Material;
}

function Card({ material }: CardProps) {
  const categoryLabelMap: Record<string, string> = {
    diet: "Diet",
    muscle: "Otot",
    heart: "Jantung",
    diabetes: "Diabetes",
  };

  return (
    <div className="flex flex-col gap-1 bg-white min-h-36 rounded-2xl shadow-md border-2 border-gray-100 p-6">
      <h2 className="font-semibold text-xl">{material.name}</h2>
      <h2 className="font-medium capitalize text-gray-600">
        {(material.categories || [])
          .map((cat) => categoryLabelMap[cat.toLowerCase()] ?? cat)
          .join(", ")}
      </h2>
      <h2 className="font-medium">
        Protein: {material.protein}g | Kalori: {material.calories} kcal
      </h2>
      <div className="flex space-x-4 justify-end mt-4 ">
        <Link
          href={`/dashboard/bahan-pangan/${material.id}`}
          className="flex items-center justify-center bg-[#007BFF] size-9 rounded-md"
        >
          <Image
            src="/view.png"
            alt="view icon"
            width={20}
            height={10}
            className="w-7"
          />
        </Link>
      </div>
    </div>
  );
}
