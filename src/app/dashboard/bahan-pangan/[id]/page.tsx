import React from "react";
import DashboardLayout from "@/app/layout/DashboardLayout";
import CDNPieChart from "@/app/components/Chart";
export default function Details() {
  return (
    <DashboardLayout>
      <div>
        <h2 className="text-2xl font-semibold text-black">
          Detail Bahan Pangan
        </h2>
        <div className="bg-[#CCE9C8] mt-10 rounded-2xl p-8 h-fit">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 h-fit bg-[#A9DBA4] rounded-2xl p-4">
                <h2 className="text-[22px] font-semibold">Informasi Utama</h2>
                <div className="grid grid-cols-[auto_min-content_1fr] gap-4 text-lg font-medium">
                  <div>Nama Bahan</div>
                  <div>:</div>
                  <div>Beras</div>
                  <div>Tanggal Pengujian</div>
                  <div>:</div>
                  <div>8 Mei 2025</div>
                  <div>Kategori Bahan Pangan</div>
                  <div>:</div>
                  <div>Serealia</div>
                  <div>Sumber / Asal</div>
                  <div>:</div>
                  <div>Serealia</div>
                  <div>Kategori Diet</div>
                  <div>:</div>
                  <div>
                    Menurunkan Berat Badan, Menurunkan Berat Badan dengan
                    riwayat diabetes
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 h-fit bg-[#A9DBA4] rounded-2xl p-4">
                <h2 className="text-[22px] font-semibold">Distribusi Utama</h2>
                <div className="grid grid-cols-3 gap-4 text-lg font-medium">
                  <div className="flex flex-row items-center gap-2">
                    <div className="size-5 border rounded-md bg-[#F28B82]"></div>
                    <h2>Kalori (7,5gr)</h2>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <div className="size-5 border rounded-md bg-[#F28B82]"></div>
                    <h2>Karbohidrat (7,5gr)</h2>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <div className="size-5 border rounded-md bg-[#F28B82]"></div>
                    <h2>Protein (7,5gr)</h2>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <div className="size-5 border rounded-md bg-[#F28B82]"></div>
                    <h2>Lemak (7,5gr)</h2>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <div className="size-5 border rounded-md bg-[#F28B82]"></div>
                    <h2>Serat (7,5gr)</h2>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <div className="size-5 border rounded-md bg-[#F28B82]"></div>
                    <h2>Serat (7,5gr)</h2>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <div className="size-5 border rounded-md bg-[#F28B82]"></div>
                    <h2>Serat (7,5gr)</h2>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <div className="size-5 border rounded-md bg-[#F28B82]"></div>
                    <h2>Serat (7,5gr)</h2>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <div className="size-5 border rounded-md bg-[#F28B82]"></div>
                    <h2>Serat (7,5gr)</h2>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <div className="size-5 border rounded-md bg-[#F28B82]"></div>
                    <h2>Serat (7,5gr)</h2>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <div className="size-5 border rounded-md bg-[#F28B82]"></div>
                    <h2>Serat (7,5gr)</h2>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <div className="size-5 border rounded-md bg-[#F28B82]"></div>
                    <h2>Serat (7,5gr)</h2>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <div className="size-5 border rounded-md bg-[#F28B82]"></div>
                    <h2>Serat (7,5gr)</h2>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <div className="size-5 border rounded-md bg-[#F28B82]"></div>
                    <h2>Serat (7,5gr)</h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 items-center h-full bg-[#A9DBA4] rounded-2xl p-4">
              <h2 className="self-start text-[22px] font-semibold">
                Visualisasi Distribusi
              </h2>
              <CDNPieChart />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
