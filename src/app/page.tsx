"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role: "nutritionist" }),
      });

      const data = await res.json();

      if (res.ok) {
        login({
          id: data.data.id,
          email: data.data.email,
          name: data.data.name,
          role: data.data.role,
          token: data.data.token,
        });


        document.cookie = `token=${data.data.token}; path=/; max-age=3600; ${
          process.env.NODE_ENV === "production" ? "secure; samesite=strict" : ""
        }`;

        router.push("/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-0">
      <div className="flex flex-col items-center gap-4 bg-[#E7F5E5] min-h-[500px] w-full max-w-md sm:max-w-lg md:max-w-xl xl:p-14 rounded-[30px] sm:w-2/3 md:w-1/2 xl:w-1/3 shadow-lg">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-[#326D2C] text-3xl sm:text-4xl font-semibold text-center">Login</h2>
          <h2 className="font-semibold text-xl sm:text-2xl text-center">Selamat datang di Lab Gizi</h2>
        </div>
        {error && <p className="text-red-500 text-base sm:text-lg font-medium text-center">{error}</p>}
        <form
          onSubmit={handleSubmit}
          className="w-full gap-4 flex flex-col items-center"
        >
          <div className="flex flex-col gap-6 mt-8 w-full">
            <input
              type="email"
              placeholder="Email"
              className="bg-white text-black placeholder-black font-medium rounded-2xl p-4 text-base sm:text-lg w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Kata Sandi"
              className="bg-white text-black placeholder-black font-medium rounded-2xl p-4 text-base sm:text-lg w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Link href="/register" className="font-semibold text-center">Belum punya akun?</Link>
            <button
              type="submit"
              className="flex space-x-2 items-center justify-center bg-[#80C978] font-semibold rounded-2xl text-lg sm:text-xl p-4 mt-3 cursor-pointer w-full"
            >
              <Image
                src="/upload.png"
                alt="upload icon"
                width={25}
                height={25}
              />
              <h2>Masuk</h2>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}