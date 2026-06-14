'use client'

import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import Image from 'next/image'
import ImageUpload from '@/components/admin/ImageUpload'
import type { TeamMember } from '@/types/database'

const emptyForm = {
  name: '', role: '', bio: '', photo_url: '',
  email: '', whatsapp: '', linkedin_url: '',
  sort_order: 0, is_active: true,
}

export default function AdminTeamPage() {
  const router = useRouter()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<TeamMember | null>(null)
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
    const { data } = await supabase.from('team_members').select('*').order('sort_order')
    setMembers(data || [])
    setLoading(false)
  }

  const openEdit = (m: TeamMember) => {
    setEditing(m)
    setForm({
      name: m.name, role: m.role, bio: m.bio || '',
      photo_url: m.photo_url || '', email: m.email || '',
      whatsapp: m.whatsapp || '', linkedin_url: m.linkedin_url || '',
      sort_order: m.sort_order, is_active: m.is_active,
    })
    setShowForm(true)
  }

  const openNew = () => {
    setEditing(null)
    setForm({ ...emptyForm })
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.role) return
    setSaving(true)
    const payload = {
      name: form.name, role: form.role,
      bio: form.bio || null, photo_url: form.photo_url || null,
      email: form.email || null, whatsapp: form.whatsapp || null,
      linkedin_url: form.linkedin_url || null,
      sort_order: form.sort_order, is_active: form.is_active,
    }
    if (editing) {
      await supabase.from('team_members').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('team_members').insert(payload)
    }
    setSaving(false)
    setShowForm(false)
    fetchData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this team member?')) return
    await supabase.from('team_members').delete().eq('id', id)
    fetchData()
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
            <p className="text-gray-500 mt-1">{members.length} members — shown on the About page</p>
          </div>
          <button onClick={openNew} className="btn-primary"><Plus className="w-4 h-4" /> Add Member</button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl p-7 w-full max-w-lg shadow-2xl my-4">
              <h2 className="text-xl font-bold text-primary mb-5">{editing ? 'Edit' : 'New'} Team Member</h2>
              <div className="space-y-4">

                <ImageUpload
                  label="Photo"
                  value={form.photo_url}
                  onChange={url => setForm(f => ({ ...f, photo_url: url }))}
                  folder="team"
                  aspectRatio="aspect-square"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name *</label>
                    <input className="input-field" value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="label">Job Title *</label>
                    <input className="input-field" value={form.role}
                      onChange={e => setForm({ ...form, role: e.target.value })} placeholder="General Manager" />
                  </div>
                </div>

                <div>
                  <label className="label">Bio</label>
                  <textarea className="input-field resize-none" rows={3} value={form.bio}
                    onChange={e => setForm({ ...form, bio: e.target.value })}
                    placeholder="Short biography..." />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Email</label>
                    <input className="input-field" type="email" value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@scs-uae.com" />
                  </div>
                  <div>
                    <label className="label">WhatsApp Number</label>
                    <input className="input-field" value={form.whatsapp}
                      onChange={e => setForm({ ...form, whatsapp: e.target.value })} placeholder="971555953901" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">LinkedIn URL</label>
                    <input className="input-field text-xs" value={form.linkedin_url}
                      onChange={e => setForm({ ...form, linkedin_url: e.target.value })} placeholder="https://linkedin.com/in/..." />
                  </div>
                  <div>
                    <label className="label">Sort Order</label>
                    <input type="number" className="input-field" value={form.sort_order}
                      onChange={e => setForm({ ...form, sort_order: +e.target.value })} />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.is_active}
                    onChange={e => setForm({ ...form, is_active: e.target.checked })} />
                  Active (visible on About page)
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={handleSave} disabled={saving || !form.name || !form.role}
                  className="btn-primary flex-1 justify-center">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Member'}
                </button>
                <button onClick={() => setShowForm(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : members.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No team members yet.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {members.map((m) => (
              <div key={m.id} className={`bg-white rounded-xl p-5 shadow-sm ${!m.is_active ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-4 mb-3">
                  {m.photo_url ? (
                    <Image src={m.photo_url} alt={m.name} width={56} height={56}
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {m.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-gray-900">{m.name}</p>
                    <p className="text-primary text-sm">{m.role}</p>
                  </div>
                </div>
                {m.bio && <p className="text-gray-500 text-xs line-clamp-2 mb-3">{m.bio}</p>}
                <div className="flex gap-2">
                  <button onClick={() => openEdit(m)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(m.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
