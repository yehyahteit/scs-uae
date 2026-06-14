'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Please provide a message (min 10 chars)'),
})
type FormData = z.infer<typeof schema>

export default function ContactForm() {
  const [success, setSuccess] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, type: 'contact' }),
    })
    if (res.ok) {
      setSuccess(true)
      reset()
    }
  }

  if (success) return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
      </div>
      <h3 className="text-xl font-bold text-primary mb-2">Message Sent!</h3>
      <p className="text-gray-600">Thank you! Our team will get back to you shortly.</p>
      <button onClick={() => setSuccess(false)} className="mt-4 btn-secondary text-sm py-2 px-4">Send Another</button>
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Full Name *</label>
          <input {...register('name')} className="input-field" placeholder="John Doe" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="label">Email *</label>
          <input {...register('email')} type="email" className="input-field" placeholder="john@company.com" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
      </div>
      <div>
        <label className="label">Phone</label>
        <input {...register('phone')} className="input-field" placeholder="+971 50 000 0000" />
      </div>
      <div>
        <label className="label">Message *</label>
        <textarea {...register('message')} rows={4} className="input-field resize-none" placeholder="How can we help you?" />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center">
        {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : 'Send Message'}
      </button>
    </form>
  )
}
