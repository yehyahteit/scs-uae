import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { supabaseAdmin } from '@/lib/supabase'
import { Mail, MessageCircle } from 'lucide-react'

export default async function MessagesPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/admin/login')

  const { data: messages } = await supabaseAdmin
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-500 mt-1">{messages?.filter(m => !m.is_read).length} unread</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {messages && messages.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {messages.map((msg) => (
                <div key={msg.id} className={`p-5 ${!msg.is_read ? 'bg-blue-50' : ''}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.type === 'quote' ? 'bg-accent/20' : 'bg-primary/10'}`}>
                        {msg.type === 'quote' ? <MessageCircle className="w-4 h-4 text-accent" /> : <Mail className="w-4 h-4 text-primary" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-gray-900">{msg.name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${msg.type === 'quote' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                            {msg.type}
                          </span>
                          {!msg.is_read && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">New</span>}
                        </div>
                        <p className="text-sm text-gray-500">{msg.email}{msg.phone ? ` · ${msg.phone}` : ''}{msg.company ? ` · ${msg.company}` : ''}</p>
                        {msg.category && <p className="text-xs text-accent mt-0.5">Category: {msg.category}{msg.quantity ? ` · Qty: ${msg.quantity}` : ''}</p>}
                        <p className="text-sm text-gray-700 mt-2">{msg.message}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleDateString()}</p>
                      <a href={`mailto:${msg.email}?subject=Re: Your inquiry to SCS UAE`}
                        className="mt-2 text-xs font-medium text-primary hover:underline block">Reply →</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">No messages yet.</div>
          )}
        </div>
      </main>
    </div>
  )
}
