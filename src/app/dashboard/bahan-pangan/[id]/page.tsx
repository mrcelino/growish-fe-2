'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/app/layout/DashboardLayout';
import { useAuth } from '@/app/context/auth';
import Image from 'next/image';
import CDNPieChart from '@/app/components/Chart';

interface MaterialDetail {
  id: string;
  name: string;
  image_url: string | null;
  material_category: string;
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
  amino_acid: number;
  vitamin_d: number;
  magnesium: number;
  iron: number;
  test_date: string;
  notes: string;
  source: string;
  categories: string[];
}

const nutrientColorMap: Record<string, string> = {
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

function NutrientItem({
  name,
  value,
  unit,
  color,
}: {
  name: string;
  value: number;
  unit: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="size-4 rounded-sm" style={{ backgroundColor: color }} />
      <span>
        {name} ({value.toFixed(1)}
        {unit})
      </span>
    </div>
  );
}

export default function DetailBahanPangan() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [material, setMaterial] = useState<MaterialDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMaterial = async () => {
      if (!user?.token || !id) return;

      try {
        setLoading(true);
        setError('');

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/materials/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Gagal memuat detail bahan pangan');
        }

        const data = await response.json();
        setMaterial(data.data);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
        router.push('/dashboard/bahan-pangan');
      } finally {
        setLoading(false);
      }
    };

    fetchMaterial();
  }, [id, user, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error || !material) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        {error || 'Data tidak ditemukan'}
      </div>
    );
  }

  const pieChartData = Object.entries(material)
    .filter(([key, value]) => key in nutrientColorMap && typeof value === 'number' && value > 0)
    .map(([key, value]) => ({
      name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: value as number,
      color: nutrientColorMap[key],
    }));

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-semibold text-black mb-5">
        Detail Informasi Bahan Pangan
      </h2>

      <div className="bg-[#CCE9C8] p-6 rounded-2xl shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Informasi Umum */}
          <div className="bg-[#A9DBA4] rounded-2xl p-6">
            <div className="text-lg font-medium">
              <div className="text-2xl font-bold mb-4">{material.name}</div>
              <div className="mb-2">Kategori: {material.material_category}</div>
              <div className="mb-2">Sumber: {material.source}</div>
              <div className="mb-2">Tanggal Uji: {material.test_date}</div>
              <div className="mb-2">Catatan: {material.notes || '-'}</div>
              <div className="mb-2">Kategori Lain:</div>
              <ul className="list-disc list-inside pl-4">
                {material.categories.map((cat, idx) => (
                  <li key={idx}>{cat}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Distribusi Nutrisi */}
          <div className="bg-[#A9DBA4] rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 text-center">Distribusi Nutrisi</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-lg font-medium">
              {pieChartData.map((item, index) => (
                <NutrientItem
                  key={index}
                  name={item.name}
                  value={item.value}
                  unit={item.name === 'Calories' ? 'kcal' : 'g'}
                  color={item.color}
                />
              ))}
            </div>
          </div>
          
        </div>

        {/* Gambar dan Pie Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 p-6">
          {/* Gambar */}
          <div className="bg-[#A9DBA4] rounded-lg p-6 flex flex-col items-center justify-center">
            {material.image_url ? (
              <Image
                src={material.image_url}
                alt={material.name}
                width={250}
                height={250}
                className="rounded-lg object-cover max-w-full max-h-64"
              />
            ) : (
              <p>Tidak ada gambar</p>
            )}
          </div>
          

          {/* Chart */}
          <div className="bg-[#A9DBA4] rounded-2xl p-6 flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold mb-4 text-center">Visualisasi Pie Chart</h2>
              <CDNPieChart data={pieChartData} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
