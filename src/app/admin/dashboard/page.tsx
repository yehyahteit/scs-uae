import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { supabaseAdmin } from '@/lib/supabase'
import { Package, Tag, Users, MessageSquare, Star } from 'lucide-react'
import Link from 'next/link'

async function getCounts() {
  const [products, categories, clients, testimonials, messages] = await Promise.all([
    supabaseAdmin.from('products').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('categories').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('clients').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('testimonials').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('contact_messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
  ])
  return {
    products: products.count ?? 0,
    categories: categories.count ?? 0,
    clients: clients.count ?? 0,
    testimonials: testimonials.count ?? 0,
    unreadMessages: messages.count ?? 0,
  }
}

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/admin/login')

  const counts = await getCounts()

  const stats = [
    { label: 'Products', value: counts.products, icon: Package, href: '/admin/products', color: 'bg-blue-500' },
    { label: 'Categories', value: counts.categories, icon: Tag, href: '/admin/categories', color: 'bg-purple-500' },
    { label: 'Clients', value: counts.clients, icon: Users, href: '/admin/clients', color: 'bg-green-500' },
    { label: 'Testimonials', value: counts.testimonials, icon: Star, href: '/admin/testimonials', color: 'bg-yellow-500' },
    { label: 'Unread Messages', value: counts.unreadMessages, icon: MessageSquare, href: '/admin/messages', color: 'bg-red-500' },
  ]

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here&rsquo;s an overview of your website.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-8">
          {stats.map((stat) => (
            <Link key={stat.label} href={stat.href} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-gray-500 text-sm mt-0.5">{stat.label}</p>
            </Link>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: 'Add New Product', href: '/admin/products' },
                { label: 'View Messages', href: '/admin/messages' },
                { label: 'Update Settings', href: '/admin/settings' },
                { label: 'View Live Site', href: '/', target: '_blank' },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  target={(action as any).target}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                >
                  {action.label}
                  <span className="text-gray-400">→</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">Manage Content</h2>
            <div className="space-y-2">
              {[
                { label: 'Products & Categories', href: '/admin/products' },
                { label: 'Client Logos', href: '/admin/clients' },
                { label: 'Testimonials', href: '/admin/testimonials' },
                { label: 'Gallery Images', href: '/admin/gallery' },
              ].map((item) => (
                <Link key={item.label} href={item.href}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                  {item.label}<span className="text-gray-400">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
