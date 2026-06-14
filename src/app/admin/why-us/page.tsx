'use client'

import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'

const emptyForm = { icon: '⭐', title: '', description: '', sort_order: 0, is_active: true }

const ICON_OPTIONS = ['🏆','💰','📦','⚡','😊','🎨','🚀','✅','🔒','🌍','🤝','💎','🎯','🛡️','⏱️','📞']

export default function AdminWhyUsPage() {
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [saving, setSaving] = useState(false)
  const supabase = supabaseBrowser()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/admin/login')
    })
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data } = await supabase.from('why_us').select('*').order('sort_order')
    setItems(data || [])
    setLoading(false)
  }

  const openNew = () => { setEditing(null); setForm({ ...emptyForm }); setShowForm(true) }
  const openEdit = (item: any) => {
    setEditing(item)
    setForm({ icon: item.icon, title: item.title, description: item.description, sort_order: item.sort_order, is_active: item.is_active })
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.title || !form.description) return
    setSaving(true)
    if (editing) {
      await supabase.from('why_us').update(form).eq('id', editing.id)
    } else {
      await supabase.from('why_us').insert(form)
    }
    setSaving(false)
    setShowForm(false)
    fetchData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return
    await supabase.from('why_us').delete().eq('id', id)
    fetchData()
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Why Choose Us</h1>
            <p className="text-gray-500 mt-1">The 6 feature cards shown on the homepage</p>
          </div>
          <button onClick={openNew} className="btn-primary"><Plus className="w-4 h-4" /> Add Item</button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl p-7 w-full max-w-md shadow-2xl my-4">
              <h2 className="text-xl font-bold text-primary mb-5">{editing ? 'Edit' : 'New'} Feature</h2>
              <div className="space-y-4">
                <div>
                  <label className="label">Icon</label>
                  <div className="grid grid-cols-8 gap-2 mt-1">
                    {ICON_OPTIONS.map(icon => (
                      <button key={icon} type="button"
                        onClick={() => setForm({ ...form, icon })}
                        className={`text-2xl p-2 rounded-lg border-2 transition-all ${form.icon === icon ? 'border-primary bg-primary/10' : 'border-gray-100 hover:border-gray-300'}`}>
                        {icon}
                      </button>
                    ))}
                  </div>
                  <input className="input-field mt-2 text-center text-2xl" value={form.icon}
                    onChange={e => setForm({ ...form, icon: e.target.value })}
                    placeholder="Or type any emoji" />
                </div>
                <div>
                  <label className="label">Title *</label>
                  <input className="input-field" value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Top Quality" />
                </div>
                <div>
                  <label className="label">Description *</label>
                  <textarea className="input-field resize-none" rows={3} value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Exceptional attention to detail..." />
                </div>
                <div>
                  <label className="label">Sort Order</label>
                  <input type="number" className="input-field" value={form.sort_order}
                    onChange={e => setForm({ ...form, sort_order: +e.target.value })} />
                </div>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.is_active}
                    onChange={e => setForm({ ...form, is_active: e.target.checked })} />
                  Active (visible on homepage)
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleSave} disabled={saving || !form.title || !form.description}
                  className="btn-primary flex-1 justify-center">
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map(item => (
              <div key={item.id} className={`bg-white rounded-xl p-5 shadow-sm border-2 border-gray-100 ${!item.is_active ? 'opacity-50' : ''}`}>
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-primary mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.description}</p>
                <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                  <button onClick={() => openEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4" /></button>
                  <span className={`ml-auto px-2 py-1 rounded-full text-xs font-semibold ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {item.is_active ? 'Active' : 'Hidden'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
