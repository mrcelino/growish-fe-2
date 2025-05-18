"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function Register() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role: 'nutritionist', 
        }),
      })

      if (!response.ok) {
        const res = await response.json()
        setError(res.message || 'Registrasi gagal')
        return
      }

      // Registrasi berhasil, redirect ke login
      router.push('/')
    } catch (err) {
      setError('Terjadi kesalahan saat registrasi')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4 bg-[#E7F5E5] min-h-[500px] xl:p-14 rounded-[30px] xl:w-1/3">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-[#326D2C] text-4xl font-semibold">Register</h2>
          <h2 className="font-semibold text-2xl">Selamat datang di LabGizi</h2>
        </div>
        {error && <p className="text-red-500 text-lg font-medium">{error}</p>}
        <form
          onSubmit={handleSubmit}
          className="w-full gap-4 flex flex-col items-center"
        >
          <div className="flex flex-col gap-6 mt-8 w-full">
            <input
              type="text"
              placeholder="Nama Lengkap"
              className="bg-white text-black placeholder-black font-medium rounded-2xl p-4 text-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="bg-white text-black placeholder-black font-medium rounded-2xl p-4 text-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Kata Sandi"
              className="bg-white text-black placeholder-black font-medium rounded-2xl p-4 text-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Link href="/login" className="font-semibold">Sudah punya akun?</Link>
            <button
              type="submit"
              className="flex space-x-2 items-center justify-center bg-[#80C978] font-semibold rounded-2xl text-xl p-4 mt-3 cursor-pointer"
            >
              <Image
                src="/upload.png"
                alt="upload icon"
                width={25}
                height={25}
              />
              <h2>Daftar</h2>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
