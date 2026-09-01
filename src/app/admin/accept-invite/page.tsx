'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { Loader2 } from 'lucide-react'

export default function AcceptInvitePage() {
  const router = useRouter()
  const supabase = supabaseBrowser()

  const [checking, setChecking] = useState(true)
  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // The invite link's URL fragment (#access_token=...) is picked up
    // automatically by the Supabase client, which fires SIGNED_IN once
    // the session from that link is established.
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) setReady(true)
      setChecking(false)
    })

    // In case the session was already established before this ran
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true)
      setChecking(false)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
      setSaving(false)
      return
    }
    router.push('/admin/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary">Welcome to SCS Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Set a password to activate your account</p>
        </div>

        {checking ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : !ready ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
            This invite link is invalid or has expired. Ask whoever invited you to send a new one.
          </div>
        ) : (
          <form onSubmit={handleSetPassword} className="space-y-5">
            <div>
              <label className="label">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="At least 8 characters"
                required
              />
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">{error}</div>
            )}
            <button type="submit" disabled={saving} className="btn-primary w-full justify-center">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Setting up...</> : 'Set Password & Sign In'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
