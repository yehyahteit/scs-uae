'use client'

import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Loader2, BarChart2 } from 'lucide-react'

const emptyForm = { label: '', value: '', sort_order: 0, is_active: true }

export default function AdminStatsPage() {
  const router = useRouter()
  const [stats, setStats] = useState<any[]>([])
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
    const { data } = await supabase.from('site_stats').select('*').order('sort_order')
    setStats(data || [])
    setLoading(false)
  }

  const openNew = () => { setEditing(null); setForm({ ...emptyForm }); setShowForm(true) }
  const openEdit = (s: any) => { setEditing(s); setForm({ label: s.label, value: s.value, sort_order: s.sort_order, is_active: s.is_active }); setShowForm(true) }

  const handleSave = async () => {
    if (!form.label || !form.value) return
    setSaving(true)
    if (editing) {
      await supabase.from('site_stats').update(form).eq('id', editing.id)
    } else {
      await supabase.from('site_stats').insert(form)
    }
    setSaving(false)
    setShowForm(false)
    fetchData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this stat?')) return
    await supabase.from('site_stats').delete().eq('id', id)
    fetchData()
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Homepage Stats</h1>
            <p className="text-gray-500 mt-1">The numbers bar shown below the hero section</p>
          </div>
          <button onClick={openNew} className="btn-primary"><Plus className="w-4 h-4" /> Add Stat</button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-7 w-full max-w-sm shadow-2xl">
              <h2 className="text-xl font-bold text-primary mb-5">{editing ? 'Edit' : 'New'} Stat</h2>
              <div className="space-y-4">
                <div>
                  <label className="label">Value <span className="text-gray-400 font-normal">(e.g. 500+)</span></label>
                  <input className="input-field text-2xl font-bold" value={form.value}
                    onChange={e => setForm({ ...form, value: e.target.value })} placeholder="500+" />
                </div>
                <div>
                  <label className="label">Label <span className="text-gray-400 font-normal">(e.g. Projects Delivered)</span></label>
                  <input className="input-field" value={form.label}
                    onChange={e => setForm({ ...form, label: e.target.value })} placeholder="Projects Delivered" />
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
                <button onClick={handleSave} disabled={saving || !form.label || !form.value}
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
          <>
            {/* Preview */}
            <div className="bg-primary rounded-2xl p-6 mb-8">
              <p className="text-white/60 text-xs uppercase tracking-widest mb-4">Live Preview</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {stats.filter(s => s.is_active).map(s => (
                  <div key={s.id}>
                    <p className="text-3xl font-extrabold text-white">{s.value}</p>
                    <p className="text-white/70 text-sm mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Label</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Order</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-bold text-primary text-xl">{s.value}</td>
                      <td className="px-6 py-4 text-gray-700">{s.label}</td>
                      <td className="px-6 py-4 text-gray-400">{s.sort_order}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {s.is_active ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => openEdit(s)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(s.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
