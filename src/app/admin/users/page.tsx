'use client'

import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import { Loader2, Mail, Trash2, UserPlus, Clock, CheckCircle2 } from 'lucide-react'

type AdminUser = {
  id: string
  email: string | null
  created_at: string
  last_sign_in_at: string | null
  status: 'active' | 'pending'
  is_you: boolean
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const supabase = supabaseBrowser()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/admin/login')
    })
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/users')
    const json = await res.json()
    if (res.ok) setUsers(json.users)
    setLoading(false)
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setNotice('')
    setInviting(true)
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const json = await res.json()
    if (res.ok) {
      setNotice(`Invite sent to ${email}`)
      setEmail('')
      fetchUsers()
    } else {
      setError(json.error || 'Failed to send invite')
    }
    setInviting(false)
  }

  const handleRemove = async (u: AdminUser) => {
    if (!confirm(`Revoke admin access for ${u.email}?`)) return
    const res = await fetch(`/api/admin/users/${u.id}`, { method: 'DELETE' })
    const json = await res.json()
    if (res.ok) {
      fetchUsers()
    } else {
      alert(json.error || 'Failed to remove user')
    }
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Users</h1>
          <p className="text-gray-500 mt-1">Invite teammates to manage this site. Everyone here has full admin access.</p>
        </div>

        {/* Invite form */}
        <section className="bg-white rounded-2xl shadow-sm p-6 mb-7">
          <div className="flex items-center gap-2 mb-5">
            <UserPlus className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-gray-900">Invite a User</h2>
          </div>
          <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3 items-start">
            <div className="flex-1 w-full">
              <input
                type="email"
                required
                className="input-field"
                placeholder="teammate@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" disabled={inviting} className="btn-primary py-2.5 px-5 shrink-0">
              {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Mail className="w-4 h-4" /> Send Invite</>}
            </button>
          </form>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm mt-4">{error}</div>
          )}
          {notice && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-sm mt-4">{notice}</div>
          )}
          <p className="text-xs text-gray-400 mt-4">
            They&rsquo;ll get an email with a link to set their password and sign in to this dashboard.
          </p>
        </section>

        {/* Users list */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Everyone with Access</h2>
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : users.length === 0 ? (
            <p className="text-sm text-gray-400">No users found.</p>
          ) : (
            <div className="space-y-2">
              {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between gap-3 py-3 px-4 rounded-xl border border-gray-100">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {u.email} {u.is_you && <span className="text-xs text-gray-400 font-normal">(you)</span>}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      {u.status === 'active' ? (
                        <><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Active</>
                      ) : (
                        <><Clock className="w-3.5 h-3.5 text-amber-500" /> Invite pending</>
                      )}
                    </p>
                  </div>
                  {!u.is_you && (
                    <button
                      onClick={() => handleRemove(u)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-md shrink-0"
                      aria-label="Revoke access"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
