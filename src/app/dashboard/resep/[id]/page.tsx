'use client';
import React, { useEffect, useState, Suspense, use } from 'react';
import DashboardLayout from '@/app/layout/DashboardLayout';
import CDNPieChart from '@/app/components/Chart';
import { useAuth } from '@/app/context/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface RecipeMaterial {
  quantity: number;
  material: string;
}

interface NutrientData {
  iron: number;
  fiber: number;
  sugar: number;
  natrium: number;
  protein: number;
  calories: number;
  magnesium: number;
  total_fat: number;
  trans_fat: number;
  vitamin_d: number;
  amino_acid: number;
  cholesterol: number;
  carbohydrates: number;
  saturated_fat: number;
}

interface RecipeData {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: string;
  imageUrl: string | null;
  nutrients: NutrientData;
  recipeMaterials: RecipeMaterial[];
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
    </div>
  );
}

function DetailsContent({ recipeId }: { recipeId: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      if (!user?.token) return;

      try {
        setIsLoading(true);
        setError('');

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/${recipeId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (!res.ok) {
          throw new Error('Gagal memuat detail resep');
        }

        const data = await res.json();
        setRecipe(data.data);
      } catch (err) {
        console.error('Error fetching recipe details:', err);
        setError(err instanceof Error ? err.message : 'Gagal memuat detail resep');
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [user, recipeId, router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Resep tidak ditemukan</p>
      </div>
    );
  }

  const steps = recipe.steps ? recipe.steps.split('\n').filter(step => step.trim() !== '') : [];

  const nutrientColorMap: Record<keyof NutrientData, string> = {
    iron: '#A0522D',
    fiber: '#4285F4',
    sugar: '#FF6D01',
    natrium: '#1E90FF',
    protein: '#34A853',
    calories: '#F28B82',
    magnesium: '#FF8C00',
    total_fat: '#EA4335',
    trans_fat: '#C71585',
    vitamin_d: '#FFD700',
    amino_acid: '#800080',
    cholesterol: '#DA70D6',
    carbohydrates: '#FBBC04',
    saturated_fat: '#FF1493',
  };

  const pieChartData = Object.entries(recipe.nutrients)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => ({
      name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value,
      color: nutrientColorMap[key as keyof NutrientData] || '#8884d8',
    }));

  return (
    <div>
      <h2 className="text-2xl font-semibold text-black mb-5">
        Detail Informasi Resep
      </h2>

      <div className="bg-[#CCE9C8] p-6 rounded-2xl shadow-lg">
        {/* Informasi Resep */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-[#A9DBA4] rounded-2xl p-6">
            <div className="text-lg font-medium">
              <div className="text-2xl font-bold mb-4">{recipe.name}</div>
              <div className="mb-2">Kategori: {recipe.category}</div>
              <div>{recipe.description || '-'}</div>
            </div>
          </div>

          <div className="bg-[#A9DBA4] rounded-2xl p-6">
            <div className="font-bold text-xl mb-4">Bahan-bahan:</div>
            <ol className="list-decimal list-inside space-y-1 mb-5">
              {recipe.recipeMaterials.map((mat, index) => (
                <li key={index}>
                  {mat.material} - {mat.quantity}g
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Bahan dan Langkah */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Distribusi Nutrisi */}
          <div className="bg-[#A9DBA4] rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 text-center">Distribusi Nutrisi</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-lg font-medium">
              <NutrientItem name="Kalori" value={recipe.nutrients.calories} unit="kcal" color="bg-[#F28B82]" />
              <NutrientItem name="Protein" value={recipe.nutrients.protein} unit="g" color="bg-[#34A853]" />
              <NutrientItem name="Karbohidrat" value={recipe.nutrients.carbohydrates} unit="g" color="bg-[#FBBC04]" />
              <NutrientItem name="Lemak Total" value={recipe.nutrients.total_fat} unit="g" color="bg-[#EA4335]" />
              <NutrientItem name="Serat" value={recipe.nutrients.fiber} unit="g" color="bg-[#4285F4]" />
              <NutrientItem name="Gula" value={recipe.nutrients.sugar} unit="g" color="bg-[#FF6D01]" />
            </div>
          </div>

          <div className="bg-[#A9DBA4] rounded-2xl p-6">
            <h3 className="font-bold text-xl mb-4">Langkah Pembuatan:</h3>
            {steps.length > 0 ? (
              <ol className="list-decimal list-inside space-y-2 pl-2">
                {steps.map((step, index) => (
                  <li key={index} className="text-lg">
                    {step}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-gray-500">Tidak ada langkah pembuatan yang tercatat</p>
            )}
          </div>
        </div>

        {/* Pie Chart & Gambar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-[#A9DBA4] rounded-2xl p-6 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 text-center">Visualisasi Pie Chart</h2>
            <CDNPieChart data={pieChartData} />
          </div>

          {recipe.imageUrl && (
            <div className="bg-[#A9DBA4] rounded-2xl p-6 flex items-center justify-center">
              <Image 
                src={recipe.imageUrl} 
                alt={recipe.name} 
                width={250} 
                height={250} 
                className="rounded-lg object-cover h-full w-full"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

}

export default function DetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params promise
  const { id } = use(params);
  
  return (
    <DashboardLayout>
      <Suspense fallback={<LoadingSpinner />}>
        <DetailsContent recipeId={id} />
      </Suspense>
    </DashboardLayout>
  );
}

function NutrientItem({ name, value, unit, color }: { 
  name: string; 
  value: number; 
  unit: string;
  color: string;
}) {
  return (
    <div className="flex flex-row items-center gap-2">
      <div className={`size-5 border rounded-md ${color}`}></div>
      <h2>{name} ({value.toFixed(1)}{unit})</h2>
    </div>
  );
}