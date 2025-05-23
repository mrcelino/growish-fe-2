'use client';
import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/app/layout/DashboardLayout';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/app/context/auth';

interface Material {
  quantity: number;
  material_id: string;
  material: { id: string; name: string };
}

interface Recipe {
  id: string;
  name: string;
  description: string;
  category: string;
  recipe_materials: Material[];
}

export default function ResepSaya() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user?.token) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recipes`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        const data = await res.json();
        if (res.ok) {
          setRecipes(data.data);
          setFilteredRecipes(data.data);
        }
      } catch (err) {
        console.error('Gagal memuat data resep:', err);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    const delay = setTimeout(() => {
      const categoryMap: { [key: string]: string } = {
        diet: 'Diet',
        muscle: 'Otot',
        heart: 'Jantung',
        diabetes: 'Diabetes',
      };

      const filtered = recipes.filter((r) => {
        const matchSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory =
          selectedCategory === 'Semua' ||
          categoryMap[r.category.toLowerCase()]?.toLowerCase() === selectedCategory.toLowerCase();

        return matchSearch && matchCategory;
      });

      setFilteredRecipes(filtered);
    }, 300);

    return () => clearTimeout(delay);
  }, [searchTerm, selectedCategory, recipes]);

  return (
    <DashboardLayout>
      <div className="flex flex-col px-4 md:px-10">
        <h2 className="text-2xl font-semibold text-black">Resep Saya</h2>

        <Menu
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          recipes={filteredRecipes}
        />
      </div>
    </DashboardLayout>
  );
}

function Menu({
  searchTerm,
  setSearchTerm,
  recipes,
  selectedCategory,
  setSelectedCategory,
}: {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  recipes: Recipe[];
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
}) {
  const categoryOptions = ['Semua', 'Diet', 'Otot', 'Jantung', 'Diabetes'];

  return (
    <div className="flex flex-col mt-5">
      {/* Filter Kategori */}
      <div className="flex flex-wrap mt-1 gap-3">
        {categoryOptions.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`border-[3px] border-[#80C978] rounded-2xl py-2 px-5 text-base sm:text-lg font-semibold flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition duration-300 ${
              selectedCategory === cat ? 'bg-[#80C978] text-white' : 'bg-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search + Tambah Resep */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <div className="flex bg-white items-center space-x-4 border-[#BFBFBF] border-2 py-3 px-4 font-medium text-base rounded-2xl w-full sm:w-3/4">
          <Image src="/search.png" alt="search" width={30} height={30} className="size-6" />
          <input
            type="text"
            placeholder="Cari Resep"
            className="w-full placeholder-black outline-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Link
          href="/dashboard/tambah"
          className="flex items-center justify-center bg-[#80C978] rounded-2xl py-3 px-4 font-semibold text-base sm:text-xl w-full sm:w-1/4"
        >
          + Tambah Resep
        </Link>
      </div>

      {/* List Resep */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6">
        {recipes.length > 0 ? (
          recipes.map((r) => <Card key={r.id} recipe={r} />)
        ) : (
          <p className="col-span-full text-center text-gray-500">Tidak ditemukan resep.</p>
        )}
      </div>
    </div>
  );
}

function Card({ recipe }: { recipe: Recipe }) {
  const ingredients = recipe.recipe_materials
    .map((rm) => `${rm.material.name} ${rm.quantity}g`)
    .join(', ');

  return (
    <div className="flex flex-col gap-1 bg-white min-h-36 rounded-2xl shadow-md border-2 border-gray-100 p-6">
      <h2 className="font-semibold text-xl">{recipe.name}</h2>
      <h2 className="font-medium text-gray-600">Bahan - bahan :</h2>
      <h2 className="font-medium">{ingredients}</h2>
      <div className="flex space-x-4 justify-end mt-4">
        <Link
          href={`/dashboard/edit/${recipe.id}`}
          className="flex items-center justify-center bg-[#E2A713] size-9 rounded-md"
        >
          <Image src="/edit.svg" alt="edit icon" width={20} height={20} className="size-6 object-cover" />
        </Link>
        <div className="flex items-center justify-center bg-[#DC3545] size-9 rounded-md">
          <Image src="/delete.svg" alt="delete icon" width={15} height={15} className="size-6" />
        </div>
        <Link
          href={`/dashboard/details/${recipe.id}`}
          className="flex items-center justify-center bg-[#007BFF] size-9 rounded-md"
        >
          <Image src="/view.png" alt="view icon" width={20} height={10} className="w-7" />
        </Link>
      </div>
    </div>
  );
}
