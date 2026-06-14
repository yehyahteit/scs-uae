import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import LiveChat from '@/components/layout/LiveChat'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function hexToRgb(hex: string) {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `${r} ${g} ${b}`
}

async function getSiteSettings() {
  // Fresh client per request — avoids any module-level singleton caching
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { fetch: (url, opts) => fetch(url, { ...opts, cache: 'no-store' }) } }
  )
  const { data } = await client
    .from('site_settings')
    .select('key, value')
    .in('key', ['whatsapp_number', 'live_chat_provider', 'tawk_property_id', 'crisp_website_id', 'primary_color', 'accent_color'])
  const settings: Record<string, string> = {}
  data?.forEach((s: any) => { if (s.key && s.value) settings[s.key] = s.value })
  return settings
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()

  const primaryColor = settings.primary_color || '#3B4BC8'
  const accentColor = settings.accent_color || '#2D2E8F'

  const darken = (hex: string) => {
    const h = hex.replace('#', '')
    const darkenChannel = (s: string) => Math.max(0, parseInt(s, 16) - 30).toString(16).padStart(2, '0')
    return `#${darkenChannel(h.substring(0,2))}${darkenChannel(h.substring(2,4))}${darkenChannel(h.substring(4,6))}`
  }

  const cssVars = `
    :root {
      --color-primary: ${hexToRgb(primaryColor)};
      --color-primary-dark: ${hexToRgb(darken(primaryColor))};
      --color-accent: ${hexToRgb(accentColor)};
      --color-accent-dark: ${hexToRgb(darken(accentColor))};
    }
  `

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppButton phone={settings.whatsapp_number || '971555953901'} />
      <LiveChat
        provider={(settings.live_chat_provider as 'tawk' | 'crisp' | 'none') || 'none'}
        tawkPropertyId={settings.tawk_property_id}
        crispWebsiteId={settings.crisp_website_id}
      />
    </>
  )
}
