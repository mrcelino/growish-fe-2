'use client';
import React, { useState, useEffect, useRef, use } from 'react';
import DashboardLayout from '@/app/layout/DashboardLayout';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/auth';
import Link from 'next/link';

interface Material {
  id: string;
  name: string;
  material_category: string;
  categories: string[];
  imageUrl?: string | null;
}

interface RecipeMaterial {
  id: string;
  quantity: number;
}

const Message = ({ type, message }: { type: 'error' | 'success'; message: string }) => {
  if (!message) return null;
  
  const baseClasses = "mb-4 p-3 rounded font-medium border";
  const typeClasses = type === 'error' 
    ? "text-red-600 bg-red-100 border-red-500" 
    : "text-green-600 bg-green-100 border-green-500";

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      {message}
    </div>
  );
};

// Loading spinner for Suspense fallback
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
    </div>
  );
}

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params promise
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [recipe, setRecipe] = useState({
    name: '',
    description: '',
    category: '',
    materials: [] as RecipeMaterial[],
    steps: [] as string[],
    imageUrl: ''
  });
  
  const [availableMaterials, setAvailableMaterials] = useState<Material[]>([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState('');
  const [materialQuantity, setMaterialQuantity] = useState(100);
  const [newStep, setNewStep] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterMaterialCategory, setFilterMaterialCategory] = useState('Semua');

  // Get unique material categories
  const materialCategories = ['Semua', ...new Set(availableMaterials.map(m => m.material_category))];

  useEffect(() => {
    if (!user?.token) return;

    const fetchData = async () => {
      try {
        // Fetch recipe details
        const recipeRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        
        if (!recipeRes.ok) throw new Error('Gagal memuat detail resep');
        
        const recipeData = await recipeRes.json();
        
        // Format materials from recipe data
        const initialMaterials = recipeData.data.recipeMaterials?.map((rm: any) => {
          // We'll update this with actual IDs after fetching available materials
          return {
            id: rm.materialId, // Temporary empty ID
            name: rm.material, // Store material name temporarily
            quantity: rm.quantity
          };
        }) || [];

        setRecipe({
          name: recipeData.data.name,
          description: recipeData.data.description || '',
          category: recipeData.data.category,
          materials: initialMaterials,
          steps: recipeData.data.steps?.split('\n').filter((step: string) => step.trim() !== '') || [],
          imageUrl: recipeData.data.imageUrl || ''
        });

        setPreviewImage(recipeData.data.imageUrl || null);
        setIsOwner(recipeData.data.userId === user.id);

        // Fetch available materials
        const materialsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materials`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        
        if (materialsRes.ok) {
          const materialsData = await materialsRes.json();
          setAvailableMaterials(materialsData.data);
          
          // Update materials with correct IDs
          if (recipeData.data.recipeMaterials) {
            const updatedMaterials = recipeData.data.recipeMaterials.map((rm: any) => {
              const material = materialsData.data.find((m: Material) => m.name === rm.material);
              return {
                id: material?.id || '',
                quantity: rm.quantity
              };
            }).filter((m: any) => m.id !== '');
            
            setRecipe(prev => ({
              ...prev,
              materials: updatedMaterials
            }));
          }
        }
        
      } catch (error) {
        console.error('Error:', error);
        alert(error instanceof Error ? error.message : 'Terjadi kesalahan');
        router.push('/dashboard/resep');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user, router]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.token) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      
      formData.append('name', recipe.name);
      formData.append('description', recipe.description);
      formData.append('category', recipe.category);
      
      // Format materials with material names
      const materialsWithNames = recipe.materials.map(m => {
        const material = availableMaterials.find(mat => mat.id === m.id);
        return {
          id: material?.id, // Use material ID
          material: material?.name || '', // Use material name
          quantity: m.quantity
        };
      }).filter(m => m.material !== '');

      formData.append('materials', JSON.stringify(materialsWithNames));
      
      // Format steps
      formData.append('steps', JSON.stringify(recipe.steps));

      if (file) {
        formData.append('image', file, file.name);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.token}`
        },
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Resep berhasil diperbarui!');
        setTimeout(() => {
          router.push('/dashboard/resep');
        }, 1500);
      } else {
        throw new Error(result.message || 'Gagal memperbarui resep');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan saat memperbarui resep');
    } finally {
      setIsSubmitting(false);
    }
  };


  const addMaterial = () => {
    if (!selectedMaterialId || recipe.materials.some(m => m.id === selectedMaterialId)) return;
    
    // Tambahkan timestamp untuk material baru
    const newMaterial = {
      id: selectedMaterialId,
      quantity: materialQuantity,
      _tempId: Date.now() // Untuk handling material belum tersimpan
    };
    
    setRecipe(prev => ({
      ...prev,
      materials: [...prev.materials, newMaterial]
    }));
  };

  const removeMaterial = (index: number) => {
    setRecipe(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }));
  };

  const addStep = () => {
    if (!newStep.trim()) return;
    
    setRecipe(prev => ({
      ...prev,
      steps: [...prev.steps, newStep.trim()]
    }));
    
    setNewStep('');
  };

  const removeStep = (index: number) => {
    setRecipe(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  // Filter materials berdasarkan kategori
  const materialsByCategory = () => {
    let filtered = availableMaterials;
    
    // Filter berdasarkan kategori resep jika ada
    if (recipe.category && recipe.category !== '') {
      filtered = filtered.filter(material => 
        material.categories.includes(recipe.category.toLowerCase())
      );
    }
    
    // Filter tambahan berdasarkan kategori bahan
    if (filterMaterialCategory !== 'Semua') {
      filtered = filtered.filter(material => 
        material.material_category === filterMaterialCategory
      );
    }
    
    return filtered;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div>Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isOwner) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="text-red-500">Anda tidak memiliki akses untuk mengedit resep ini</div>
          <Link 
            href="/dashboard/resep"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Kembali ke Daftar Resep
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <React.Suspense fallback={<LoadingSpinner />}>
        <h2 className="text-2xl font-semibold text-black mb-4">Edit Resep</h2>

        {/* Pesan Error dan Sukses */}
        <Message type="error" message={error || ''} />
        <Message type="success" message={success || ''} />

        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-4">Data Utama</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="block font-medium mb-2">Nama Resep</label>
                  <input
                    type="text"
                    value={recipe.name}
                    onChange={(e) => setRecipe({...recipe, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Contoh: Nasi Ayam Sehat"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2">Deskripsi</label>
                  <textarea
                    value={recipe.description}
                    onChange={(e) => setRecipe({...recipe, description: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[100px]"
                    placeholder="Deskripsi singkat tentang resep"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2">Kategori Resep</label>
                  <select
                    value={recipe.category}
                    onChange={(e) => setRecipe({...recipe, category: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
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
                    {previewImage ? (
                      <img 
                        src={previewImage} 
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
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    {previewImage ? 'Ganti Gambar' : 'Pilih Gambar'}
                  </button>
                  {file && (
                    <p className="mt-2 text-sm text-gray-600">
                      {file.name} ({(file.size / 1024).toFixed(2)} KB)
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
                    value={filterMaterialCategory}
                    onChange={(e) => setFilterMaterialCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    {materialCategories.map(kategori => (
                      <option key={kategori} value={kategori}>{kategori}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-1/2"
                    value={selectedMaterialId}
                    onChange={(e) => setSelectedMaterialId(e.target.value)}
                    disabled={!recipe.category}
                  >
                    <option value="">Pilih Bahan</option>
                    {materialsByCategory().map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.material_category})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={materialQuantity}
                    onChange={(e) => setMaterialQuantity(parseInt(e.target.value))}
                    className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-1/4"
                    placeholder="Jumlah (g)"
                  />
                  <button
                    type="button"
                    onClick={addMaterial}
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
                        <th className="p-3 font-medium">Jumlah (gram)</th>
                        <th className="p-3 font-medium">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recipe.materials.map((b, i) => {
                        const materialDetail = availableMaterials.find(m => m.id === b.id);
                        return (
                          <tr 
                              key={materialDetail?.id || `material-${b.id}-${i}`} // ✅
                              className="border-b"
                            >
                            <td className="p-3">
                              {materialDetail?.name || 'Bahan tidak ditemukan (ID: ' + b.id + ')'}
                            </td>
                            <td className="p-3">{b.quantity}g</td>
                            <td className="p-3">
                              <button
                                type="button"
                                onClick={() => removeMaterial(i)}
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
                    value={newStep}
                    onChange={(e) => setNewStep(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    placeholder="Masukkan langkah"
                  />
                  <button
                    type="button"
                    onClick={addStep}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    + Tambah Langkah
                  </button>
                </div>
                <ol className="list-decimal ml-5 mb-6 space-y-2">
                  {recipe.steps.map((step, i) => (
                    <li key={`step-${i}-${step.substring(0,5).replace(/\s+/g, '-')}`} className="flex justify-between items-start">
                      <span className="flex-1">{step}</span>
                      <button
                        type="button"
                        onClick={() => removeStep(i)}
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
                type="button"
                onClick={() => router.push('/dashboard/resep')}
                className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-md ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      </React.Suspense>
    </DashboardLayout>
  );
}