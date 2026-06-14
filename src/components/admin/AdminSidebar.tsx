'use client'

import Link from 'next/link'
import NextImage from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Package, Users, MessageSquare, Star,
  Settings, Image, LogOut, ChevronRight, UserCircle, BarChart2, ThumbsUp
} from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/team', label: 'Team', icon: UserCircle },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/gallery', label: 'Gallery', icon: Image },
  { href: '/admin/stats', label: 'Stats Bar', icon: BarChart2 },
  { href: '/admin/why-us', label: 'Why Choose Us', icon: ThumbsUp },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = supabaseBrowser()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <aside className="w-64 min-h-screen bg-primary text-white flex flex-col shrink-0">
      <div className="p-5 border-b border-white/10">
        <NextImage
          src="/logo.svg"
          alt="SCS Logo"
          width={160}
          height={62}
          className="object-contain brightness-0 invert"
        />
        <p className="text-xs text-white/40 mt-2">Content Management</p>
      </div>

      <nav className="flex-1 py-4">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-5 py-3 text-sm transition-colors',
              pathname === href || pathname.startsWith(href + '/')
                ? 'bg-white/15 text-white font-semibold border-r-4 border-accent'
                : 'text-gray-300 hover:bg-white/10 hover:text-white'
            )}
          >
            <Icon className="w-5 h-5 shrink-0" />
            {label}
            {(pathname === href) && <ChevronRight className="w-3 h-3 ml-auto" />}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-300 hover:text-white text-sm w-full px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  )
}
