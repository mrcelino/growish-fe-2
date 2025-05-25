'use client';
import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/app/layout/DashboardLayout";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from '@/app/context/auth';

interface Material {
  id: string;
  name: string;
  image_url: string | null;
  calories: number;
  protein: number;
  total_fat: number;
  saturated_fat: number;
  trans_fat: number;
  cholesterol: number;
  carbohydrates: number;
  sugar: number;
  fiber: number;
  natrium: number;
  amino_acid: number | null;
  vitamin_d: number | null;
  magnesium: number | null;
  iron: number | null;
  material_category: string;
  categories: string[];
  notes: string;
  source: string;
}

export default function MaterialsPage() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        const data = await response.json();
        if (response.ok) {
          setMaterials(data.data);
        } else {
          console.error("Failed to fetch materials:", data.message);
        }
      } catch (err) {
        console.error("Error fetching materials:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div>Loading materials...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col px-4 md:px-10">
        <h2 className="text-2xl font-semibold text-black mb-6">Daftar Bahan Pangan</h2>
        <MaterialsList materials={materials} />
      </div>
    </DashboardLayout>
  );
}

function MaterialsList({ materials }: { materials: Material[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>(materials);
  const inputRef = useRef<HTMLInputElement>(null);

  const categoryMap: { [key: string]: string } = {
    heart: "Jantung",
    diabetes: "Diabetes",
    muscle: "Otot",
    diet: "Diet",
  };

  const categoryOptions = ["Semua", "Diet", "Otot", "Jantung", "Diabetes"];

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const filtered = materials.filter((m) => {
        const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory =
          selectedCategory === "Semua" ||
          (m.categories && m.categories.some(c => {
            const translated = categoryMap[c.toLowerCase()];
            return translated?.toLowerCase() === selectedCategory.toLowerCase();
          }));

        return matchesSearch && matchesCategory;
      });

      setFilteredMaterials(filtered);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, selectedCategory, materials]);

  return (
    <div className="flex flex-col">
      {/* Filter Kategori */}
      <div className="flex flex-wrap gap-3 mb-6">
        {categoryOptions.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`border-[3px] border-[#80C978] rounded-2xl py-2 px-5 text-base font-semibold ${
              selectedCategory === category ? "bg-[#80C978] text-white" : "bg-white"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="flex gap-4 mb-6">
        <div className="flex bg-white items-center space-x-4 border-[#BFBFBF] border-2 py-3 px-4 font-medium text-base rounded-2xl w-full">
          <Image src="/search.png" alt="search" width={24} height={24} className="size-6" />
          <input
            type="text"
            placeholder="Cari bahan pangan..."
            className="w-full placeholder-black outline-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* <Link
          href="/dashboard/bahan/tambah"
          className="flex items-center justify-center bg-[#80C978] rounded-2xl py-3 px-4 font-semibold text-base whitespace-nowrap"
        >
          + Tambah Bahan
        </Link> */}
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMaterials.length > 0 ? (
          filteredMaterials.map((material) => (
            <MaterialCard key={material.id} material={material} />
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            Tidak ditemukan bahan pangan
          </div>
        )}
      </div>
    </div>
  );
}

function MaterialCard({ material }: { material: Material }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow p-6">
      {/* Material Image */}
      <div className="relative h-48 w-full bg-gray-100">
        {material.image_url ? (
          material.image_url.startsWith('http') ? (
            <Image
              src={material.image_url}
              alt={material.name}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              unoptimized={process.env.NODE_ENV !== 'production'} // Optional: only optimize in production
            />
          ) : (
            // Handle local or other image paths if needed
            <div className="h-full flex items-center justify-center text-gray-400">
              Invalid Image URL
            </div>
          )
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Rest of the component remains the same */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{material.name}</h3>
        <p className="text-gray-600 mb-1">
          <span className="font-medium">Kategori:</span> {material.material_category}
        </p>
        <p className="text-gray-600 mb-1">
          <span className="font-medium">Kalori:</span> {material.calories} kcal
        </p>
        <p className="text-gray-600 mb-3">
          <span className="font-medium">Protein:</span> {material.protein}g
        </p>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          {/* <Link
            href={`/dashboard/bahan/edit/${material.id}`}
            className="flex items-center justify-center bg-[#E2A713] size-8 rounded-md hover:bg-[#d49b12] transition-colors"
            title="Edit"
          >
            <Image src="/edit.svg" alt="edit" width={16} height={16} />
          </Link>
          <button
            className="flex items-center justify-center bg-[#DC3545] size-8 rounded-md hover:bg-[#c82333] transition-colors"
            title="Hapus"
          >
            <Image src="/delete.svg" alt="delete" width={14} height={14} />
          </button> */}
          <Link
            href={`/dashboard/bahan-pangan/${material.id}`}
            className="flex items-center justify-center bg-[#007BFF] size-8 rounded-md hover:bg-[#0069d9] transition-colors"
            title="Detail"
          >
            <Image src="/view.png" alt="view" width={18} height={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}