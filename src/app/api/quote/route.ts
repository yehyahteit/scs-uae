import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone, company, category, quantity, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { error } = await supabaseAdmin.from('contact_messages').insert({
      type: 'quote',
      name,
      email,
      phone: phone || null,
      company: company || null,
      message,
      category: category || null,
      quantity: quantity || null,
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Quote API error:', err)
    return NextResponse.json({ error: 'Failed to submit quote' }, { status: 500 })
  }
}
