'use client'

import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Loader2, Star } from 'lucide-react'
import type { Testimonial } from '@/types/database'

export default function AdminTestimonialsPage() {
  const router = useRouter()
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [form, setForm] = useState({ author_name: '', author_role: '', company: '', content: '', rating: 5, is_active: true, sort_order: 0 })
  const [saving, setSaving] = useState(false)

  const supabase = supabaseBrowser()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/admin/login')
    })
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data } = await supabase.from('testimonials').select('*').order('sort_order')
    setItems(data || [])
    setLoading(false)
  }

  const openEdit = (t: Testimonial) => {
    setEditing(t)
    setForm({ author_name: t.author_name, author_role: t.author_role || '', company: t.company || '', content: t.content, rating: t.rating, is_active: t.is_active, sort_order: t.sort_order })
    setShowForm(true)
  }

  const openNew = () => {
    setEditing(null)
    setForm({ author_name: '', author_role: '', company: '', content: '', rating: 5, is_active: true, sort_order: 0 })
    setShowForm(true)
  }

  const handleSave = async () => {
    setSaving(true)
    if (editing) {
      await supabase.from('testimonials').update(form).eq('id', editing.id)
    } else {
      await supabase.from('testimonials').insert(form)
    }
    setSaving(false)
    setShowForm(false)
    fetchData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return
    await supabase.from('testimonials').delete().eq('id', id)
    fetchData()
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
          <button onClick={openNew} className="btn-primary"><Plus className="w-4 h-4" /> Add Testimonial</button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-7 w-full max-w-lg shadow-2xl">
              <h2 className="text-xl font-bold text-primary mb-5">{editing ? 'Edit' : 'New'} Testimonial</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Author Name *</label>
                    <input className="input-field" value={form.author_name} onChange={e => setForm({...form, author_name: e.target.value})} />
                  </div>
                  <div>
                    <label className="label">Role/Title</label>
                    <input className="input-field" value={form.author_role} onChange={e => setForm({...form, author_role: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="label">Company</label>
                  <input className="input-field" value={form.company} onChange={e => setForm({...form, company: e.target.value})} />
                </div>
                <div>
                  <label className="label">Testimonial *</label>
                  <textarea className="input-field resize-none" rows={4} value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
                </div>
                <div>
                  <label className="label">Rating (1-5)</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} type="button" onClick={() => setForm({...form, rating: n})}>
                        <Star className={`w-6 h-6 ${n <= form.rating ? 'fill-accent text-accent' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
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
          <div className="grid md:grid-cols-2 gap-5">
            {items.map((t) => (
              <div key={t.id} className={`bg-white rounded-xl p-5 shadow-sm ${!t.is_active ? 'opacity-50' : ''}`}>
                <div className="flex gap-1 mb-2">
                  {Array.from({length: t.rating}).map((_, i) => <Star key={i} className="w-4 h-4 fill-accent text-accent" />)}
                </div>
                <p className="text-gray-700 italic text-sm mb-3">&ldquo;{t.content}&rdquo;</p>
                <p className="font-semibold text-primary text-sm">{t.author_name}</p>
                {t.author_role && <p className="text-gray-400 text-xs">{t.author_role}{t.company ? `, ${t.company}` : ''}</p>}
                <div className="flex gap-2 mt-4">
                  <button onClick={() => openEdit(t)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(t.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
