'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'

const categories = [
  'Restaurant & Hotel Uniform',
  'Medical Uniform',
  'Facility Management',
  'Industrial & Safety',
  'SPA & Salon',
  'Schools & Nursery',
  'Corporate Uniform',
  'Embroidery Services',
  'Printing Services',
  'Other / Multiple',
]

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  company: z.string().optional(),
  category: z.string().min(1, 'Please select a category'),
  quantity: z.string().min(1, 'Quantity is required'),
  message: z.string().min(10, 'Please describe your requirements'),
})
type FormData = z.infer<typeof schema>

export default function QuoteForm() {
  const [success, setSuccess] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    const res = await fetch('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, type: 'quote' }),
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
      <h3 className="text-xl font-bold text-primary mb-2">Quote Request Sent!</h3>
      <p className="text-gray-600">We&rsquo;ll send you a custom quote within 24 hours.</p>
      <button onClick={() => setSuccess(false)} className="mt-4 btn-secondary text-sm py-2 px-4">New Request</button>
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
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Phone</label>
          <input {...register('phone')} className="input-field" placeholder="+971 50 000 0000" />
        </div>
        <div>
          <label className="label">Company Name</label>
          <input {...register('company')} className="input-field" placeholder="Acme Hotel LLC" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Product Category *</label>
          <select {...register('category')} className="input-field">
            <option value="">Select a category</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
        </div>
        <div>
          <label className="label">Quantity (approximate) *</label>
          <input {...register('quantity')} className="input-field" placeholder="e.g. 50 pieces" />
          {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
        </div>
      </div>
      <div>
        <label className="label">Requirements / Details *</label>
        <textarea {...register('message')} rows={4} className="input-field resize-none" placeholder="Describe colors, fabric, logo, delivery timeline, etc." />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className="btn-accent w-full justify-center">
        {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : 'Submit Quote Request'}
      </button>
    </form>
  )
}
