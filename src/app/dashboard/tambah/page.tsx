'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/app/layout/DashboardLayout';
import { useAuth } from '@/app/context/auth';

interface Material {
  id: string;
  name: string;
}

export default function TambahResepPage() {
  const { user } = useAuth();
  const [namaResep, setNamaResep] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [kategori, setKategori] = useState('');
  const [bahanTersedia, setBahanTersedia] = useState<Material[]>([]);
  const [bahan, setBahan] = useState<{ id: string; jumlah: number }[]>([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState('');
  const [jumlahBahan, setJumlahBahan] = useState(100);
  const [langkah, setLangkah] = useState<string[]>([]);
  const [langkahBaru, setLangkahBaru] = useState('');

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

    const payload = {
      name: namaResep,
      description: deskripsi,
      category: kategori.toLowerCase(),
      materials: bahan.map((b) => ({ id: b.id, quantity: b.jumlah })),
      steps: langkah,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recipes`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Resep berhasil ditambahkan!');
        setNamaResep('');
        setDeskripsi('');
        setKategori('');
        setBahan([]);
        setLangkah([]);
      } else {
        alert('Gagal tambah resep: ' + data.error);
      }
    } catch (err) {
      console.error('Gagal simpan resep:', err);
    }
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-semibold text-black mb-4">Tambah Resep</h2>
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-4">Data Utama</h3>
        <div className="grid grid-cols-2 gap-6 mb-6">
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
            <input
              type="text"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Contoh: Nasi merah dengan ayam kukus"
            />
          </div>
          <div className="col-span-1">
            <label className="block font-medium mb-2">Kategori Resep</label>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Pilih Kategori</option>
              <option value="diet">Diet</option>
              <option value="otot">Otot</option>
              <option value="jantung">Jantung</option>
              <option value="diabetes">Diabetes</option>
            </select>
          </div>
        </div>

        {/* Grid 2 kolom untuk Bahan dan Langkah */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bagian Pilih Bahan */}
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-4">Pilih Bahan</h3>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <select
                className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-1/2"
                value={selectedMaterialId}
                onChange={(e) => setSelectedMaterialId(e.target.value)}
              >
                <option value="">Pilih Bahan</option>
                {bahanTersedia.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
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
                className="bg-green-600 text-white px-4 py-2 rounded-md"
              >
                + Tambah Bahan
              </button>
            </div>
            <table className="w-full text-left border-t border-gray-200 mb-5">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 font-medium">Nama bahan</th>
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
                      <td className="p-3">{b.jumlah}g</td>
                      <td className="p-3">
                        <button
                          onClick={() => hapusBahan(i)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
                className="bg-green-600 text-white px-4 py-2 rounded-md"
              >
                + Tambah Langkah
              </button>
            </div>
            <ol className="list-decimal ml-5 mb-6">
              {langkah.map((l, i) => (
                <li key={i} className="flex justify-between items-center mb-2">
                  <span>{l}</span>
                  <button
                    onClick={() => hapusLangkah(i)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-6 flex gap-4 justify-start">
          <button className="bg-red-500 text-white px-6 py-2 rounded-md">Batal</button>
          <button
            onClick={simpanResep}
            className="bg-green-600 text-white px-6 py-2 rounded-md"
          >
            Simpan
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

