import React from "react";
import DashboardLayout from "@/app/layout/DashboardLayout";
import Link from "next/link";
import Image from "next/image";
export default function page() {
  return (
    <DashboardLayout>
      <h2 className="text-2xl font-semibold text-black">
        Riwayat Bahan Pangan
      </h2>
      <div className="flex mt-6 space-x-5">
        <div className="border-[3px] border-[#80C978] rounded-2xl py-2 px-5 text-xl font-semibold flex items-center justify-center bg-white shadow-md">
          Semua
        </div>
        <div className="border-[3px] border-[#80C978] rounded-2xl py-2 px-5 text-xl font-semibold flex items-center justify-center bg-white shadow-md">
          Diet
        </div>
        <div className="border-[3px] border-[#80C978] rounded-2xl py-2 px-5 text-xl font-semibold flex items-center justify-center bg-white shadow-md">
          Otot
        </div>
        <div className="border-[3px] border-[#80C978] rounded-2xl py-2 px-5 text-xl font-semibold flex items-center justify-center bg-white shadow-md">
          Jantung
        </div>
        <div className="border-[3px] border-[#80C978] rounded-2xl py-2 px-5 text-xl font-semibold flex items-center justify-center bg-white shadow-md">
          Diabetes
        </div>
      </div>
      <div className="flex gap-5 mt-8">
        <div className="flex bg-white items-center space-x-4 border-[#BFBFBF] border-2 py-4 px-4 font-medium text-lg rounded-2xl w-3/4">
          <Image
            src="/search.png"
            alt="food"
            width={30}
            height={30}
            className="size-6"
          />
          <input
            type="text"
            placeholder="Cari Bahan Pangan"
            className="w-full placeholder-black outline-0"
          ></input>
        </div>
        <div className="flex items-center justify-center bg-[#80C978] rounded-2xl py-3 px-4 font-medium text-lg w-1/4">
          <Link href="/dashboard/tambah" className="font-semibold text-xl">+ Tambah Bahan Pangan</Link>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-10 mt-6">
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </DashboardLayout>
  );
}

function Card() {
  return (
    <div className="flex flex-col gap-1 bg-white min-h-36 rounded-2xl shadow-md border-2 border-gray-100 p-6">
      <h2 className="font-semibold text-xl">Beras Merah</h2>
      <h2 className="font-medium">Biji-bijian</h2>
      <h2 className="font-medium">Protein: 7,5g | Kalori: 350 kcal</h2>
      <div className="flex space-x-4 justify-end mt-4 ">
        <div className="flex items-center justify-center bg-[#007BFF] size-9 rounded-md">
          <Image
            src="/view.png"
            alt="view icon"
            width={20}
            height={10}
            className="w-7"
          />
        </div>
      </div>
    </div>
  );
}