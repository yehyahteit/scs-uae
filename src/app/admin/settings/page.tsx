'use client'

import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import ImageUpload from '@/components/admin/ImageUpload'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import { Loader2, Save, Palette, Phone, Share2, Image as ImageIcon, MessageSquare } from 'lucide-react'

type Settings = Record<string, string>

const DEFAULTS: Settings = {
  primary_color: '#3b3fce',
  accent_color: '#1a1c6b',
  logo_url: '',
  site_name: 'SCS UAE',
  tagline: 'Premium Uniform Supplier Since 2012',
  phone: '+971 55 595 3901',
  email: 'info@scs-uae.com',
  address: 'Dubai, UAE',
  whatsapp_number: '971555953901',
  facebook_url: '',
  instagram_url: '',
  linkedin_url: '',
  tiktok_url: '',
  live_chat_provider: 'none',
  tawk_property_id: '',
  crisp_website_id: '',
}

export default function AdminSettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<Settings>({ ...DEFAULTS })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const supabase = supabaseBrowser()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/admin/login')
    })
    supabase.from('site_settings').select('*').then(({ data }) => {
      if (data) {
        const map: Settings = { ...DEFAULTS }
        data.forEach(row => { map[row.key] = row.value ?? '' })
        setSettings(map)
      }
      setLoading(false)
    })
  }, [])

  const set = (key: string, value: string) => setSettings(s => ({ ...s, [key]: value }))

  const saveSection = async (keys: string[], sectionId: string) => {
    setSaving(sectionId)
    const upserts = keys.map(key => ({ key, value: settings[key] ?? '' }))
    await supabase.from('site_settings').upsert(upserts, { onConflict: 'key' })
    setSaving(null)
    setSaved(sectionId)
    setTimeout(() => setSaved(null), 2500)
  }

  function SaveBtn({ keys, id }: { keys: string[]; id: string }) {
    const isSaving = saving === id
    const isSaved = saved === id
    return (
      <button onClick={() => saveSection(keys, id)} disabled={isSaving} className="btn-primary py-2 px-5 text-sm gap-1.5">
        {isSaving
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : isSaved
          ? '✓ Saved!'
          : <><Save className="w-4 h-4" /> Save</>}
      </button>
    )
  }

  if (loading) return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </main>
    </div>
  )

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
          <p className="text-gray-500 mt-1">Control branding, colors, contact info, and social links</p>
        </div>

        <div className="space-y-7">

          {/* ── LOGO & BRAND ── */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-gray-900">Logo & Brand</h2>
              </div>
              <SaveBtn keys={['logo_url', 'site_name', 'tagline']} id="brand" />
            </div>
            <div className="space-y-4">
              <ImageUpload
                label="Logo Image"
                value={settings.logo_url}
                onChange={url => set('logo_url', url)}
                folder="branding"
                aspectRatio="aspect-[4/1]"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Site Name</label>
                  <input className="input-field" value={settings.site_name} onChange={e => set('site_name', e.target.value)} />
                </div>
                <div>
                  <label className="label">Tagline</label>
                  <input className="input-field" value={settings.tagline} onChange={e => set('tagline', e.target.value)} />
                </div>
              </div>
            </div>
          </section>

          {/* ── COLORS ── */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-gray-900">Brand Colors</h2>
              </div>
              <SaveBtn keys={['primary_color', 'accent_color']} id="colors" />
            </div>
            <div className="grid grid-cols-2 gap-8">
              {[
                { key: 'primary_color', label: 'Primary Color', hint: 'Buttons, links, highlights' },
                { key: 'accent_color', label: 'Accent / Dark Color', hint: 'Headings, dark sections' },
              ].map(({ key, label, hint }) => (
                <div key={key}>
                  <label className="label">{label}</label>
                  <p className="text-xs text-gray-400 mb-2">{hint}</p>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings[key]}
                      onChange={e => set(key, e.target.value)}
                      className="w-14 h-14 rounded-xl border-2 border-gray-200 cursor-pointer p-1 shrink-0"
                    />
                    <div className="flex-1">
                      <input
                        className="input-field font-mono text-sm"
                        value={settings[key]}
                        onChange={e => set(key, e.target.value)}
                        placeholder="#3b3fce"
                      />
                      <div className="mt-2 h-7 rounded-lg transition-colors" style={{ backgroundColor: settings[key] }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Preview */}
            <div className="mt-6 p-4 rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Live Preview</p>
              <div className="flex items-center gap-3 flex-wrap">
                <button className="px-5 py-2 rounded-lg text-white text-sm font-semibold shadow" style={{ backgroundColor: settings.primary_color }}>
                  Primary Button
                </button>
                <span className="text-sm font-bold underline" style={{ color: settings.primary_color }}>Primary Link</span>
                <div className="px-4 py-2 rounded-lg text-white text-sm font-semibold" style={{ backgroundColor: settings.accent_color }}>
                  Dark Section
                </div>
              </div>
            </div>
            <p className="text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2 mt-4">
              ✓ Colors are applied site-wide automatically. After saving, refresh the website to see the changes.
            </p>
          </section>

          {/* ── CONTACT ── */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-gray-900">Contact Information</h2>
              </div>
              <SaveBtn keys={['phone', 'email', 'address', 'whatsapp_number']} id="contact" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Phone</label>
                <input className="input-field" value={settings.phone} onChange={e => set('phone', e.target.value)} placeholder="+971 55 595 3901" />
              </div>
              <div>
                <label className="label">WhatsApp <span className="text-gray-400 font-normal">(digits only)</span></label>
                <input className="input-field" value={settings.whatsapp_number} onChange={e => set('whatsapp_number', e.target.value)} placeholder="971555953901" />
              </div>
              <div>
                <label className="label">Email</label>
                <input className="input-field" type="email" value={settings.email} onChange={e => set('email', e.target.value)} placeholder="info@scs-uae.com" />
              </div>
              <div>
                <label className="label">Address</label>
                <input className="input-field" value={settings.address} onChange={e => set('address', e.target.value)} placeholder="Dubai, UAE" />
              </div>
            </div>
          </section>

          {/* ── SOCIAL ── */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-gray-900">Social Media</h2>
              </div>
              <SaveBtn keys={['facebook_url', 'instagram_url', 'linkedin_url', 'tiktok_url']} id="social" />
            </div>
            <div className="space-y-4">
              {[
                { key: 'facebook_url', label: 'Facebook URL', placeholder: 'https://facebook.com/scs-uae' },
                { key: 'instagram_url', label: 'Instagram URL', placeholder: 'https://instagram.com/scs_uae' },
                { key: 'linkedin_url', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/company/scs-uae' },
                { key: 'tiktok_url', label: 'TikTok URL', placeholder: 'https://tiktok.com/@scs_uae' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="label">{label}</label>
                  <input className="input-field" value={settings[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder} />
                </div>
              ))}
            </div>
          </section>

          {/* ── LIVE CHAT ── */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-gray-900">Live Chat</h2>
              </div>
              <SaveBtn keys={['live_chat_provider', 'tawk_property_id', 'crisp_website_id']} id="chat" />
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Provider</label>
                <select className="input-field" value={settings.live_chat_provider} onChange={e => set('live_chat_provider', e.target.value)}>
                  <option value="none">None (disabled)</option>
                  <option value="tawk">Tawk.to</option>
                  <option value="crisp">Crisp</option>
                </select>
              </div>
              {settings.live_chat_provider === 'tawk' && (
                <div>
                  <label className="label">Tawk.to Property ID</label>
                  <input className="input-field font-mono text-sm" value={settings.tawk_property_id} onChange={e => set('tawk_property_id', e.target.value)} placeholder="xxxxxxxx/default" />
                </div>
              )}
              {settings.live_chat_provider === 'crisp' && (
                <div>
                  <label className="label">Crisp Website ID</label>
                  <input className="input-field font-mono text-sm" value={settings.crisp_website_id} onChange={e => set('crisp_website_id', e.target.value)} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
                </div>
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}
