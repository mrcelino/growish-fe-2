import { Navbar } from "../components/Navbar";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return(
    <div className="bg-[#F5F5F5] min-h-screen">
      <Navbar />
      <main className="pt-32 min-h-screen mx-20">{children}</main>
      <footer className="bg-[#CCE9C8] h-20 py-4 mt-20"/>
    </div>
  )
}