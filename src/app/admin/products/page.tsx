'use client'

import { useEffect, useState, useRef } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Loader2, Upload, X, EyeOff, Eye, GripVertical } from 'lucide-react'
import Image from 'next/image'
import type { Product } from '@/types/database'

interface ImageItem {
  url: string
  hidden: boolean
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState({ name: '', description: '', is_featured: false, is_active: true })
  const [images, setImages] = useState<ImageItem[]>([])
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 })
  const dragIdx = useRef<number | null>(null)
  const dragOverIdx = useRef<number | null>(null)

  const supabase = supabaseBrowser()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/admin/login')
    })
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts((data as any) || [])
    setLoading(false)
  }

  const openEdit = (p: Product) => {
    setEditing(p)
    setForm({ name: p.name, description: p.description || '', is_featured: p.is_featured, is_active: p.is_active })
    setImages((p.images || []).map((url: string) => ({ url, hidden: false })))
    setShowForm(true)
  }

  const openNew = () => {
    setEditing(null)
    setForm({ name: '', description: '', is_featured: false, is_active: true })
    setImages([])
    setShowForm(true)
  }

  const compressImage = (file: File, maxWidth = 1200, quality = 0.78): Promise<Blob> =>
    new Promise((resolve, reject) => {
      const img = document.createElement('img')
      const objectUrl = URL.createObjectURL(file)
      img.onload = () => {
        URL.revokeObjectURL(objectUrl)
        const scale = Math.min(1, maxWidth / img.width)
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('compression failed')), 'image/jpeg', quality)
      }
      img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('load failed')) }
      img.src = objectUrl
    })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let files = Array.from(e.target.files || [])
    if (!files.length) return
    // Filter out duplicates by filename against already-uploaded images
    const existingNames = new Set(
      images.map(img => img.url.split('/').pop()?.split('?')[0] ?? '')
    )
    const uniqueFiles = files.filter(f => !existingNames.has(f.name))
    const skipped = files.length - uniqueFiles.length
    if (skipped > 0) alert(`${skipped} duplicate file${skipped > 1 ? 's were' : ' was'} skipped.`)
    if (!uniqueFiles.length) { e.target.value = ''; return }
    files = uniqueFiles

    // Also deduplicate within the current selection by filename
    const seen = new Set<string>()
    files = files.filter(f => { if (seen.has(f.name)) return false; seen.add(f.name); return true })

    setUploading(true)
    setUploadProgress({ done: 0, total: files.length })

    // Compress in batches of 5, then immediately upload that batch
    // This keeps memory low and UI responsive
    const BATCH = 5
    for (let i = 0; i < files.length; i += BATCH) {
      const batch = files.slice(i, i + BATCH)

      // Upload this batch — skip compression for large batches to avoid hanging
      const batchItems: ImageItem[] = []
      await Promise.all(batch.map(async (file) => {
        try {
          const name = `products/${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`
          const { data, error } = await supabase.storage.from('gallery').upload(name, file, { contentType: file.type || 'image/jpeg' })
          if (!error && data) {
            const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(data.path)
            batchItems.push({ url: urlData.publicUrl, hidden: false })
          }
        } catch (_) {}
      }))

      setImages(prev => [...prev, ...batchItems])
      setUploadProgress({ done: Math.min(i + BATCH, files.length), total: files.length })
    }

    setUploading(false)
    setUploadProgress({ done: 0, total: 0 })
    e.target.value = ''
  }

  const removeImage = (idx: number) => setImages(prev => prev.filter((_, i) => i !== idx))
  const toggleHide = (idx: number) => setImages(prev => prev.map((img, i) => i === idx ? { ...img, hidden: !img.hidden } : img))

  const onDragStart = (idx: number) => { dragIdx.current = idx }
  const onDragEnter = (idx: number) => { dragOverIdx.current = idx }
  const onDragEnd = () => {
    const from = dragIdx.current
    const to = dragOverIdx.current
    if (from === null || to === null || from === to) return
    setImages(prev => {
      const arr = [...prev]
      const [moved] = arr.splice(from, 1)
      arr.splice(to, 0, moved)
      return arr
    })
    dragIdx.current = null
    dragOverIdx.current = null
  }

  const handleSave = async () => {
    if (!form.name) return
    setSaving(true)
    const payload = {
      name: form.name,
      description: form.description || null,
      images: images.filter(img => !img.hidden).map(img => img.url),
      is_featured: form.is_featured,
      is_active: form.is_active,
    }
    if (editing) {
      await supabase.from('products').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('products').insert(payload)
    }
    setSaving(false)
    setShowForm(false)
    fetchData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    fetchData()
  }

  const visibleCount = images.filter(i => !i.hidden).length

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-500 mt-1">{products.length} products</p>
          </div>
          <button onClick={openNew} className="btn-primary"><Plus className="w-4 h-4" /> Add Product</button>
        </div>

        {/* Form modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl p-7 w-full max-w-2xl shadow-2xl my-8">
              <h2 className="text-xl font-bold text-primary mb-5">{editing ? 'Edit' : 'New'} Product</h2>
              <div className="space-y-4">

                <div>
                  <label className="label">Product Name *</label>
                  <input className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>

                <div>
                  <label className="label">Description</label>
                  <textarea className="input-field resize-none" rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                </div>

                {/* Image Upload */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="label mb-0">
                      Product Images
                      {images.length > 0 && (
                        <span className="ml-2 text-xs font-normal text-gray-400">
                          {visibleCount} visible · {images.length - visibleCount} hidden
                        </span>
                      )}
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer btn-secondary text-sm py-1.5 px-3">
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      {uploading
                        ? uploadProgress.total > 0
                          ? `${uploadProgress.done} / ${uploadProgress.total}`
                          : 'Uploading...'
                        : 'Upload'}
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload} disabled={uploading} />
                    </label>
                  </div>

                  {images.length === 0 && !uploading && (
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
                      No images yet — click Upload to add photos
                    </div>
                  )}

                  {images.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {images.map((img, idx) => (
                        <div
                          key={idx}
                          draggable
                          onDragStart={() => onDragStart(idx)}
                          onDragEnter={() => onDragEnter(idx)}
                          onDragEnd={onDragEnd}
                          onDragOver={e => e.preventDefault()}
                          className={`relative group rounded-xl overflow-hidden border-2 transition-all cursor-grab active:cursor-grabbing ${
                            img.hidden ? 'border-gray-200 opacity-40' : idx === 0 ? 'border-primary' : 'border-gray-200'
                          }`}
                          style={{ aspectRatio: '1' }}
                        >
                          <Image src={img.url} alt={`Image ${idx + 1}`} fill sizes="160px" className="object-cover pointer-events-none" />
                          <div className="absolute top-1 left-1 bg-black/40 text-white rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <GripVertical className="w-3 h-3" />
                          </div>
                          {idx === 0 && !img.hidden && (
                            <span className="absolute bottom-1 left-1 bg-primary text-white text-xs px-1.5 py-0.5 rounded font-medium">Cover</span>
                          )}
                          {img.hidden && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                              <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">Hidden</span>
                            </div>
                          )}
                          <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => toggleHide(idx)} className="bg-white/90 text-gray-700 rounded-full p-1 hover:bg-white shadow">
                              {img.hidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            </button>
                            <button onClick={() => removeImage(idx)} className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {images.length > 0 && (
                    <p className="text-xs text-gray-400 mt-2">Drag to reorder · First image is the cover · Hover for hide/remove options</p>
                  )}
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={form.is_featured} onChange={e => setForm({...form, is_featured: e.target.checked})} />
                    Featured
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} />
                    Active
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={handleSave} disabled={saving || !form.name} className="btn-primary flex-1 justify-center">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                </button>
                <button onClick={() => setShowForm(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600">Name</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600 hidden lg:table-cell">Images</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600 hidden lg:table-cell">Status</th>
                  <th className="px-5 py-3 text-right font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.length === 0 && (
                  <tr><td colSpan={4} className="text-center py-10 text-gray-400">No products yet.</td></tr>
                )}
                {products.map((p: any) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-900">
                      <div className="flex items-center gap-3">
                        {p.images?.[0] ? (
                          <Image src={p.images[0]} alt={p.name} width={44} height={44} className="w-11 h-11 rounded-lg object-cover shrink-0" />
                        ) : (
                          <div className="w-11 h-11 rounded-lg bg-gray-100 shrink-0 flex items-center justify-center text-gray-300 text-xs">No img</div>
                        )}
                        {p.name}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500 hidden lg:table-cell">{p.images?.length || 0} photo{p.images?.length !== 1 ? 's' : ''}</td>
                    <td className="px-5 py-3 hidden lg:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {p.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
