'use client'

import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import ImageUpload from '@/components/admin/ImageUpload'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import Image from 'next/image'
import type { Client } from '@/types/database'

export default function AdminClientsPage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Client | null>(null)
  const [form, setForm] = useState({ name: '', logo_url: '', website_url: '', sort_order: 0, is_active: true })
  const [saving, setSaving] = useState(false)

  const supabase = supabaseBrowser()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/admin/login')
    })
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data } = await supabase.from('clients').select('*').order('sort_order')
    setClients(data || [])
    setLoading(false)
  }

  const openEdit = (c: Client) => {
    setEditing(c)
    setForm({ name: c.name, logo_url: c.logo_url || '', website_url: c.website_url || '', sort_order: c.sort_order, is_active: c.is_active })
    setShowForm(true)
  }

  const openNew = () => {
    setEditing(null)
    setForm({ name: '', logo_url: '', website_url: '', sort_order: 0, is_active: true })
    setShowForm(true)
  }

  const handleSave = async () => {
    setSaving(true)
    if (editing) {
      await supabase.from('clients').update(form).eq('id', editing.id)
    } else {
      await supabase.from('clients').insert(form)
    }
    setSaving(false)
    setShowForm(false)
    fetchData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this client?')) return
    await supabase.from('clients').delete().eq('id', id)
    fetchData()
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
            <p className="text-gray-500 mt-1">{clients.length} clients</p>
          </div>
          <button onClick={openNew} className="btn-primary"><Plus className="w-4 h-4" /> Add Client</button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl p-7 w-full max-w-md shadow-2xl my-4">
              <h2 className="text-xl font-bold text-primary mb-5">{editing ? 'Edit' : 'New'} Client</h2>
              <div className="space-y-4">
                <div>
                  <label className="label">Client Name *</label>
                  <input className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <ImageUpload
                  label="Logo"
                  value={form.logo_url}
                  onChange={url => setForm(f => ({ ...f, logo_url: url }))}
                  folder="clients"
                  aspectRatio="aspect-video"
                />
                <div>
                  <label className="label">Website URL</label>
                  <input className="input-field text-xs" value={form.website_url} onChange={e => setForm({...form, website_url: e.target.value})} placeholder="https://..." />
                </div>
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
        ) : clients.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No clients yet.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {clients.map((c) => (
              <div key={c.id} className={`bg-white rounded-xl p-4 shadow-sm text-center ${!c.is_active ? 'opacity-50' : ''}`}>
                {c.logo_url && (
                  <div className="h-16 flex items-center justify-center mb-3">
                    <Image src={c.logo_url} alt={c.name} width={100} height={60} className="h-12 w-auto object-contain" />
                  </div>
                )}
                <p className="text-sm font-medium text-gray-800 mb-3">{c.name}</p>
                <div className="flex gap-2 justify-center">
                  <button onClick={() => openEdit(c)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(c.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
