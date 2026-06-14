'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'
import { supabaseBrowser } from '@/lib/supabase-browser'

interface Props {
  value: string
  onChange: (url: string) => void
  folder?: string
  label?: string
  aspectRatio?: string // e.g. 'aspect-square', 'aspect-video'
}

export default function ImageUpload({ value, onChange, folder = 'uploads', label = 'Image', aspectRatio = 'aspect-video' }: Props) {
  const [uploading, setUploading] = useState(false)
  const supabase = supabaseBrowser()

  const compressImage = (file: File, maxWidth = 1200, quality = 0.82): Promise<Blob> =>
    new Promise((resolve) => {
      const img = document.createElement('img')
      const objectUrl = URL.createObjectURL(file)
      img.onload = () => {
        URL.revokeObjectURL(objectUrl)
        const scale = Math.min(1, maxWidth / img.width)
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(blob => resolve(blob!), 'image/jpeg', quality)
      }
      img.src = objectUrl
    })

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const compressed = await compressImage(file)
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
    const { data, error } = await supabase.storage.from('gallery').upload(fileName, compressed, { contentType: 'image/jpeg' })
    if (!error && data) {
      const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(data.path)
      onChange(urlData.publicUrl)
    }
    setUploading(false)
    e.target.value = ''
  }

  return (
    <div>
      <label className="label">{label}</label>
      {value ? (
        <div className="relative group w-full rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
          <div className={`relative w-full ${aspectRatio}`}>
            <Image src={value} alt="Preview" fill sizes="400px" className="object-contain" />
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
            <label className="cursor-pointer bg-white text-gray-700 rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-gray-100 flex items-center gap-1.5">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Replace
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
            <button
              onClick={() => onChange('')}
              className="bg-red-500 text-white rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-red-600 flex items-center gap-1.5"
            >
              <X className="w-4 h-4" /> Remove
            </button>
          </div>
        </div>
      ) : (
        <label className={`flex flex-col items-center justify-center w-full ${aspectRatio} max-h-40 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors`}>
          {uploading ? (
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Click to upload</span>
              <span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP</span>
            </>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      )}
    </div>
  )
}
