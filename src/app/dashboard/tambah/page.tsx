'use client';
import React, { useEffect, useState, useRef } from 'react';
import DashboardLayout from '@/app/layout/DashboardLayout';
import { useAuth } from '@/app/context/auth';
import { useRouter } from 'next/navigation';

interface Material {
  id: string;
  name: string;
  material_category: string;
  categories: string[];
  image_url?: string | null;
}

export default function TambahResepPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [namaResep, setNamaResep] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [kategori, setKategori] = useState('');
  const [bahanTersedia, setBahanTersedia] = useState<Material[]>([]);
  const [bahan, setBahan] = useState<{ id: string; jumlah: number }[]>([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState('');
  const [jumlahBahan, setJumlahBahan] = useState(100);
  const [langkah, setLangkah] = useState<string[]>([]);
  const [langkahBaru, setLangkahBaru] = useState('');
  const [gambar, setGambar] = useState<File | null>(null);
  const [previewGambar, setPreviewGambar] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterKategoriBahan, setFilterKategoriBahan] = useState<string>('Semua');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      if (!user?.token) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        if (res.ok) setBahanTersedia(data.data);
        else console.error(data.message);
      } catch (err) {
        console.error('Error fetching materials:', err);
      }
    };

    fetchMaterials();
  }, [user]);

  const handleGambarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setGambar(file);
      
      // Buat preview gambar
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewGambar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter bahan berdasarkan kategori resep
  const bahanTerfilter = () => {
    if (!kategori || kategori === '') return bahanTersedia;
    
    return bahanTersedia.filter(material => 
      material.categories.includes(kategori.toLowerCase())
    );
  };

  // Filter bahan berdasarkan kategori bahan
  const bahanBerdasarkanKategori = () => {
    let filtered = bahanTerfilter();
    
    if (filterKategoriBahan !== 'Semua') {
      filtered = filtered.filter(material => 
        material.material_category === filterKategoriBahan
      );
    }
    
    return filtered;
  };

  // Dapatkan daftar kategori bahan unik
  const daftarKategoriBahan = ['Semua', ...new Set(bahanTersedia.map(b => b.material_category))];

  const tambahBahan = () => {
    if (!selectedMaterialId || bahan.some(b => b.id === selectedMaterialId)) return;
    setBahan(prev => [...prev, { id: selectedMaterialId, jumlah: jumlahBahan }]);
    setSelectedMaterialId('');
    setJumlahBahan(100);
  };

  const hapusBahan = (index: number) => {
    setBahan(bahan.filter((_, i) => i !== index));
  };

  const tambahLangkah = () => {
    if (!langkahBaru.trim()) return;
    setLangkah(prev => [...prev, langkahBaru.trim()]);
    setLangkahBaru('');
  };

  const hapusLangkah = (index: number) => {
    setLangkah(langkah.filter((_, i) => i !== index));
  };

  const simpanResep = async () => {
    if (!user?.token) return;
    if (!namaResep || !kategori || bahan.length === 0 || langkah.length === 0) {
      alert('Harap lengkapi semua data yang diperlukan');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', namaResep);
    formData.append('description', deskripsi);
    formData.append('category', kategori.toLowerCase());
    formData.append('materials', JSON.stringify(
      bahan.map(b => ({ id: b.id, quantity: b.jumlah }))
    ));
    formData.append('steps', JSON.stringify(langkah));
    if (gambar) {
      formData.append('image', gambar);
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recipes`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert('Resep berhasil ditambahkan!');
        router.push('/dashboard');
      } else {
        throw new Error(data.message || 'Gagal menambahkan resep');
      }
    } catch (err) {
      console.error('Gagal simpan resep:', err);
      alert(err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan resep');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-semibold text-black mb-4">Tambah Resep</h2>
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-4">Data Utama</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-2">Nama Resep</label>
              <input
                type="text"
                value={namaResep}
                onChange={(e) => setNamaResep(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Contoh: Nasi Ayam Sehat"
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Deskripsi</label>
              <textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[100px]"
                placeholder="Deskripsi singkat tentang resep"
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Kategori Resep</label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Pilih Kategori</option>
                <option value="diet">Diet</option>
                <option value="muscle">Otot</option>
                <option value="heart">Jantung</option>
                <option value="diabetes">Diabetes</option>
              </select>
            </div>
          </div>

          {/* Upload Gambar */}
          <div>
            <label className="block font-medium mb-2">Gambar Resep</label>
            <div className="flex flex-col items-center">
              <div className="w-full h-48 bg-gray-100 rounded-md mb-4 overflow-hidden flex items-center justify-center">
                {previewGambar ? (
                  <img 
                    src={previewGambar} 
                    alt="Preview resep" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500">Belum ada gambar</span>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleGambarChange}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                {previewGambar ? 'Ganti Gambar' : 'Pilih Gambar'}
              </button>
              {gambar && (
                <p className="mt-2 text-sm text-gray-600">
                  {gambar.name} ({(gambar.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Grid 2 kolom untuk Bahan dan Langkah */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bagian Pilih Bahan */}
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-4">Pilih Bahan</h3>
            
            {/* Filter Kategori Bahan */}
            <div className="mb-4">
              <label className="block font-medium mb-2">Filter Kategori Bahan</label>
              <select
                value={filterKategoriBahan}
                onChange={(e) => setFilterKategoriBahan(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                {daftarKategoriBahan.map(kategori => (
                  <option key={kategori} value={kategori}>{kategori}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <select
                className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-1/2"
                value={selectedMaterialId}
                onChange={(e) => setSelectedMaterialId(e.target.value)}
                disabled={!kategori}
              >
                <option value="">Pilih Bahan</option>
                {bahanBerdasarkanKategori().map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.material_category})
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                value={jumlahBahan}
                onChange={(e) => setJumlahBahan(parseInt(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-1/4"
                placeholder="Jumlah (g)"
              />
              <button
                onClick={tambahBahan}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                disabled={!selectedMaterialId}
              >
                + Tambah Bahan
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-t border-gray-200 mb-5">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 font-medium">Nama bahan</th>
                    <th className="p-3 font-medium">Kategori</th>
                    <th className="p-3 font-medium">Jumlah (gram)</th>
                    <th className="p-3 font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {bahan.map((b, i) => {
                    const bahanDetail = bahanTersedia.find(bt => bt.id === b.id);
                    return (
                      <tr key={i} className="border-b">
                        <td className="p-3">{bahanDetail?.name || 'Tidak ditemukan'}</td>
                        <td className="p-3">{bahanDetail?.material_category || '-'}</td>
                        <td className="p-3">{b.jumlah}g</td>
                        <td className="p-3">
                          <button
                            onClick={() => hapusBahan(i)}
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bagian Langkah Pembuatan */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Langkah Pembuatan</h3>
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                value={langkahBaru}
                onChange={(e) => setLangkahBaru(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                placeholder="Masukkan langkah"
              />
              <button
                onClick={tambahLangkah}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                + Tambah Langkah
              </button>
            </div>
            <ol className="list-decimal ml-5 mb-6 space-y-2">
              {langkah.map((l, i) => (
                <li key={i} className="flex justify-between items-start">
                  <span className="flex-1">{l}</span>
                  <button
                    onClick={() => hapusLangkah(i)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2"
                  >
                    Hapus
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-6 flex gap-4 justify-end">
          <button 
            onClick={() => router.push('/dashboard')}
            className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
          >
            Batal
          </button>
          <button
            onClick={simpanResep}
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-md ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Resep'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}