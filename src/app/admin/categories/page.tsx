'use client'

import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import ImageUpload from '@/components/admin/ImageUpload'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import Image from 'next/image'
import type { Category } from '@/types/database'
import { slugify } from '@/lib/utils'

export default function AdminCategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState({ name: '', slug: '', description: '', image_url: '', sort_order: 0, is_active: true })
  const [saving, setSaving] = useState(false)

  const supabase = supabaseBrowser()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/admin/login')
    })
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data } = await supabase.from('categories').select('*').order('sort_order')
    setCategories(data || [])
    setLoading(false)
  }

  const openEdit = (c: Category) => {
    setEditing(c)
    setForm({ name: c.name, slug: c.slug, description: c.description || '', image_url: c.image_url || '', sort_order: c.sort_order, is_active: c.is_active })
    setShowForm(true)
  }

  const openNew = () => {
    setEditing(null)
    setForm({ name: '', slug: '', description: '', image_url: '', sort_order: 0, is_active: true })
    setShowForm(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const payload = { ...form, slug: form.slug || slugify(form.name) }
    if (editing) {
      await supabase.from('categories').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('categories').insert(payload)
    }
    setSaving(false)
    setShowForm(false)
    fetchData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category? Products in it will become uncategorized.')) return
    await supabase.from('categories').delete().eq('id', id)
    fetchData()
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-500 mt-1">{categories.length} categories</p>
          </div>
          <button onClick={openNew} className="btn-primary"><Plus className="w-4 h-4" /> Add Category</button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl p-7 w-full max-w-lg shadow-2xl my-4">
              <h2 className="text-xl font-bold text-primary mb-5">{editing ? 'Edit' : 'New'} Category</h2>
              <div className="space-y-4">
                <div>
                  <label className="label">Name *</label>
                  <input className="input-field" value={form.name}
                    onChange={e => setForm({...form, name: e.target.value, slug: slugify(e.target.value)})} />
                </div>
                <div>
                  <label className="label">Slug (URL)</label>
                  <input className="input-field" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} />
                </div>
                <div>
                  <label className="label">Description</label>
                  <textarea className="input-field resize-none" rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                </div>
                <ImageUpload
                  label="Cover Image"
                  value={form.image_url}
                  onChange={url => setForm(f => ({ ...f, image_url: url }))}
                  folder="categories"
                  aspectRatio="aspect-video"
                />
                <div>
                  <label className="label">Sort Order</label>
                  <input type="number" className="input-field" value={form.sort_order} onChange={e => setForm({...form, sort_order: +e.target.value})} />
                </div>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} />
                  Active (visible on site)
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center">
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
                  <th className="px-5 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">Slug</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600 hidden lg:table-cell">Order</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600 hidden lg:table-cell">Status</th>
                  <th className="px-5 py-3 text-right font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-900">
                      <div className="flex items-center gap-3">
                        {c.image_url ? (
                          <Image src={c.image_url} alt={c.name} width={44} height={44} className="w-11 h-11 rounded-lg object-cover shrink-0" />
                        ) : (
                          <div className="w-11 h-11 rounded-lg bg-gray-100 shrink-0" />
                        )}
                        {c.name}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-400 font-mono text-xs hidden md:table-cell">{c.slug}</td>
                    <td className="px-5 py-3 text-gray-500 hidden lg:table-cell">{c.sort_order}</td>
                    <td className="px-5 py-3 hidden lg:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {c.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(c)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(c.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4" /></button>
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
