import Image from "next/image"

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4 bg-[#E7F5E5] min-h-[500px]  xl:p-14 rounded-[30px] xl:w-1/3">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-[#326D2C] text-4xl font-semibold">Login</h2>
            <h2 className="font-semibold text-2xl">Selamat datang di Labora</h2>
          </div>
          <form className="w-full gap-4 flex flex-col items-center">
            <div className="flex flex-col gap-6 mt-8 w-full">
              <input type="text" placeholder="Nama Pengguna" className="bg-white text-black placeholder-black  font-medium rounded-2xl p-4 text-lg" />
              <input type="password" placeholder="Kata Sandi" className="bg-white text-black placeholder-black font-medium rounded-2xl p-4  text-lg" />
              <button type="submit" className="flex space-x-2 items-center justify-center bg-[#80C978] font-semibold rounded-2xl text-xl p-4 mt-6 cursor-pointer">
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
  )
}
