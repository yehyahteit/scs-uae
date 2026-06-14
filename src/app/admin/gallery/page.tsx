'use client'

import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import ImageUpload from '@/components/admin/ImageUpload'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import Image from 'next/image'
import type { GalleryImage } from '@/types/database'

export default function AdminGalleryPage() {
  const router = useRouter()
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ url: '', alt_text: '', section: 'hero', sort_order: 0, is_active: true })
  const [saving, setSaving] = useState(false)

  const supabase = supabaseBrowser()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/admin/login')
    })
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data } = await supabase.from('gallery_images').select('*').order('sort_order')
    setImages(data || [])
    setLoading(false)
  }

  const handleSave = async () => {
    if (!form.url) return
    setSaving(true)
    await supabase.from('gallery_images').insert(form)
    setSaving(false)
    setShowForm(false)
    fetchData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this image?')) return
    await supabase.from('gallery_images').delete().eq('id', id)
    fetchData()
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Gallery Images</h1>
          <button onClick={() => { setForm({ url: '', alt_text: '', section: 'hero', sort_order: 0, is_active: true }); setShowForm(true) }} className="btn-primary">
            <Plus className="w-4 h-4" /> Add Image
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl p-7 w-full max-w-md shadow-2xl my-4">
              <h2 className="text-xl font-bold text-primary mb-5">Add Gallery Image</h2>
              <div className="space-y-4">
                <ImageUpload
                  label="Image"
                  value={form.url}
                  onChange={url => setForm(f => ({ ...f, url }))}
                  folder="gallery"
                  aspectRatio="aspect-video"
                />
                <div>
                  <label className="label">Alt Text</label>
                  <input className="input-field" value={form.alt_text} onChange={e => setForm({...form, alt_text: e.target.value})} />
                </div>
                <div>
                  <label className="label">Section</label>
                  <select className="input-field" value={form.section} onChange={e => setForm({...form, section: e.target.value})}>
                    <option value="hero">Hero / Slideshow</option>
                    <option value="about">About Page</option>
                    <option value="services">Services Page</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleSave} disabled={saving || !form.url} className="btn-primary flex-1 justify-center">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                </button>
                <button onClick={() => setShowForm(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : images.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No gallery images yet.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {images.map((img) => (
              <div key={img.id} className="relative group rounded-xl overflow-hidden shadow-sm bg-gray-100 h-36">
                <Image src={img.url} alt={img.alt_text || ''} fill sizes="200px" className="object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 bg-red-600 text-white rounded-full transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1 truncate">
                  {img.section}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
