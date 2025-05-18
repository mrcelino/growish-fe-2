"use client";
import React, { useState } from "react";
import DashboardLayout from "@/app/layout/DashboardLayout";
import Image from "next/image";

export default function EditResepPage() {
  const [namaResep, setNamaResep] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [kategori, setKategori] = useState("");
  const [bahan, setBahan] = useState([{ nama: "Nasi merah", jumlah: "100g" }]);

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-semibold text-black mb-4">Edit Resep</h2>
      <div className="bg-white rounded-xl p-6 shadow-md">
        {/* Data Utama */}
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
              <option value="Diet">Diet</option>
              <option value="Otot">Otot</option>
              <option value="Jantung">Jantung</option>
              <option value="Diabetes">Diabetes</option>
            </select>
          </div>
        </div>

        {/* Pilih Bahan */}
        <h3 className="text-lg font-semibold mb-4">Pilih Bahan</h3>
        <button className="bg-green-600 text-white px-4 py-2 rounded-md mb-4">
          + Tambah Resep
        </button>

        <table className="w-full text-left border-t border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 font-medium">Nama bahan</th>
              <th className="p-3 font-medium">Jumlah (gram)</th>
              <th className="p-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {bahan.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="p-3">{item.nama}</td>
                <td className="p-3">{item.jumlah}</td>
                <td className="p-3">
                  <button
                    onClick={() =>
                      setBahan(bahan.filter((_, i) => i !== index))
                    }
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tombol Simpan dan Batal */}
        <div className="mt-6 flex gap-4 justify-end">
          <button className="bg-red-500 text-white px-6 py-2 rounded-md">
            Batal
          </button>
          <button className="bg-green-600 text-white px-6 py-2 rounded-md">
            Simpan
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
