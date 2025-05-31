'use client';
import { useState, useEffect, useRef, use } from 'react';
import DashboardLayout from '@/app/layout/DashboardLayout';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/app/context/auth';
import { useRouter } from 'next/navigation';

interface Material {
  quantity: number;
  material_id: string;
  material: {
    id: string;
    name: string;
  };
}

interface Recipe {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string | null;
  recipe_materials: Material[];
}

interface RecipeStats {
  totalRecipes: number;
  totalMaterials: number;
}

export default function Home() {

  const { user } = useAuth();
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [stats, setStats] = useState<RecipeStats>({
    totalRecipes: 0,
    totalMaterials: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [materials, setMaterials] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState('');

  const fetchData = async () => {
    if (!user?.token) return;

    try {
      const [recipesRes, statsRes, materialsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes`, {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/stats`, {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/materials`, {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
      ]);

      const [recipesData, statsData, materialsData] = await Promise.all([
        recipesRes.json(),
        statsRes.json(),
        materialsRes.json(),
      ]);

      if (recipesRes.ok) {
        setRecipes(recipesData.data);
        setFilteredRecipes(recipesData.data);
      } else {
        console.error('Gagal fetch recipes:', recipesData.message);
      }

      if (statsRes.ok) {
        setStats((prev) => ({
          ...prev,
          totalRecipes: statsData.data.totalRecipes,
        }));
      } else {
        console.error('Gagal fetch stats:', statsData.message);
      }

      if (materialsRes.ok) {
        setStats((prev) => ({
          ...prev,
          totalMaterials: materialsData.data.length,
        }));
      } else {
        console.error('Gagal fetch materials:', materialsData.message);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    if (!user?.token) {
      alert('Anda harus login untuk menghapus resep');
      return;
    }

    if (!confirm('Apakah Anda yakin ingin menghapus resep ini?')) {
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        alert('Resep berhasil dihapus');
        // Perbarui data resep tanpa perlu refresh halaman
        setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== id));
        setFilteredRecipes(prevFiltered => prevFiltered.filter(recipe => recipe.id !== id));
        // Perbarui statistik
        setStats(prev => ({
          ...prev,
          totalRecipes: prev.totalRecipes - 1
        }));
      } else {
        throw new Error(data.message || 'Gagal menghapus resep');
      }
    } catch (err) {
      console.error('Error deleting recipe:', err);
      alert(err instanceof Error ? err.message : 'Terjadi kesalahan saat menghapus resep');
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const categoryMap: { [key: string]: string } = {
        diet: "Diet",
        muscle: "Otot",
        heart: "Jantung",
        diabetes: "Diabetes",
      };

      const filtered = recipes.filter((r) => {
        const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
          selectedCategory === "Semua" ||
          categoryMap[r.category.toLowerCase()]?.toLowerCase() === selectedCategory.toLowerCase();

        return matchesSearch && matchesCategory;
      });

      setFilteredRecipes(filtered);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, recipes, selectedCategory]);

  return (
    <DashboardLayout>
      <div className="flex flex-col px-4 md:px-10">
        <h2 className="text-2xl font-semibold text-black mt-4">
          Selamat datang, {user?.name || 'Pengguna'}
        </h2>

          {/* Alert Error */}
          {error && (
            <div className="text-red-600 mb-4 p-3 rounded bg-red-100 border border-red-500">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Alert Success */}
          {success && (
            <div className="text-green-600 mb-4 p-3 rounded bg-green-100 border border-green-500">
              <p className="font-medium">{success}</p>
            </div>
          )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          <StatCard title="Total Resep" className="bg-[#80C978]" value={stats.totalRecipes} />
          <StatCard title="Total Bahan Pangan" className="bg-[#F9E781]" value={stats.totalMaterials} />
        </div>

        <Menu
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          recipes={filteredRecipes}
          onDelete={handleDeleteRecipe}
        />
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, className }: { title: string; value: number; className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl p-6 mt-6 min-h-44 shadow-md gap-2 ${className ?? 'bg-[#A9DBA4]'}`}>
      <h2 className="text-3xl font-bold">{value}</h2>
      <h2 className="text-2xl font-semibold text-center">{title}</h2>
    </div>
  );
}

function Menu({ 
  searchTerm, 
  setSearchTerm, 
  recipes, 
  selectedCategory, 
  setSelectedCategory,
  onDelete,
}: {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  recipes: Recipe[];
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  onDelete: (id: string) => void;
}) {
  const categoryOptions = ["Semua", "Diet", "Otot", "Jantung", "Diabetes"];

  return (
    <div className="flex flex-col mt-10">
      <h2 className="text-2xl font-semibold text-black">
        Resep berdasarkan kategori
      </h2>
      {/* Kategori filter */}
      <div className="flex flex-wrap mt-6 gap-3">
        {categoryOptions.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`border-[3px] border-[#80C978] rounded-2xl py-2 px-5 text-base sm:text-lg font-semibold flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition duration-300 ${
              selectedCategory === category ? "bg-[#80C978] text-white" : "bg-white"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
        {recipes.length > 0 ? (
          recipes.map((r) => <Card key={r.id} recipe={r} onDelete={onDelete} />)
        ) : (
          <p className="col-span-full text-center text-gray-500 py-10">Tidak ditemukan resep.</p>
        )}
      </div>
    </div>
  );
}

function Card({ recipe, onDelete }: { recipe: Recipe; onDelete: (id: string) => void }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(recipe.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-md border-2 border-gray-100 overflow-hidden hover:shadow-lg transition-shadow h-full p-4">
      {/* Recipe Image */}
      <div className="relative h-50 w-full rounded-lg overflow-hidden">
        {recipe.imageUrl ? (
          <Image
            src={recipe.imageUrl}
            alt={recipe.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="bg-gray-200 h-full w-full flex items-center justify-center">
            <Image
              src="/recipe-placeholder.png"
              alt="No image"
              width={100}
              height={100}
              className="opacity-50"
            />
          </div>
        )}
      </div>
      
      {/* Recipe Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="font-semibold text-xl mb-2 line-clamp-1">{recipe.name}</h2>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 mt-auto pt-2">
          {/* <Link
            href={`/dashboard/edit/${recipe.id}`}
            className="flex items-center justify-center bg-[#E2A713] size-8 rounded-md hover:bg-[#d49b12] transition-colors"
            title="Edit Resep"
          >
            <Image src="/edit.svg" alt="edit icon" width={16} height={16} />
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`flex items-center justify-center size-8 rounded-md transition-colors ${
              isDeleting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#DC3545] hover:bg-[#c82333]'
            }`}
            title="Hapus Resep"
          >
            {isDeleting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
            ) : (
              <Image src="/delete.svg" alt="delete icon" width={14} height={14} />
            )}
          </button> */}
          <Link
            href={`/dashboard/resep/${recipe.id}`}
            className="flex items-center justify-center bg-[#007BFF] size-8 rounded-md hover:bg-[#0069d9] transition-colors"
            title="Lihat Detail"
          >
            <Image src="/view.png" alt="view icon" width={18} height={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}