import DashboardLayout from "../layout/DashboardLayout";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <DashboardLayout>
        <Stats />
        <Menu />
    </DashboardLayout>
  );
}

function Card() {
  return (
    <div className="flex flex-col gap-1 bg-white min-h-36 rounded-2xl shadow-md border-2 border-gray-100 p-6">
      <h2 className="font-semibold text-xl">Nasi Ayam Sehat</h2>
      <h2 className="font-medium text-gray-600">Bahan - bahan : </h2>
      <h2 className="font-medium">Nasi merah 100 g, ayam kukus 100g</h2>
      <div className="flex space-x-4 justify-end mt-4 ">
        <Link
          href="/dashboard/edit"
          className="flex items-center justify-center bg-[#E2A713] size-9 rounded-md"
        >
          <Image
            src="/edit.svg"
            alt="edit icon"
            width={20}
            height={20}
            className="size-6 object-cover"
          />
        </Link>
        <div className="flex items-center justify-center bg-[#DC3545] size-9 rounded-md">
          <Image
            src="/delete.svg"
            alt="delete icon"
            width={15}
            height={15}
            className="size-6"
          />
        </div>
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

function Stats() {
  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-semibold text-black">
        Selamat datang, Marcel
      </h2>
      <div className="grid grid-cols-3 gap-10">
        <div className="flex flex-col items-center justify-center bg-[#80C978] rounded-2xl p-8 mt-6 min-h-44 shadow-md gap-2">
          <h2 className="text-3xl font-bold">120</h2>
          <h2 className="text-2xl font-semibold">Total Resep</h2>
        </div>
        <div className="flex flex-col items-center justify-center bg-[#F9E781] rounded-2xl p-4 mt-6 min-h-44 shadow-md gap-2">
          <h2 className="text-3xl font-bold">15</h2>
          <h2 className="text-2xl font-semibold">Total Bahan Pangan</h2>
        </div>
      </div>
    </div>
  );
}

function Menu() {
  return (
    <div className="flex flex-col mt-10">
      <h2 className="text-2xl font-semibold text-black">
        Resep berdasarkan kategori
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
            placeholder="Cari Resep"
            className="w-full placeholder-black outline-0"
          ></input>
        </div>
        <div className="flex items-center justify-center bg-[#80C978] rounded-2xl py-3 px-4 font-medium text-lg w-1/4">
          <Link href="/dashboard/tambah" className="font-semibold text-xl">+ Tambah Resep</Link>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-10 mt-6">
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
}

