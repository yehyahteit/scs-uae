'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

interface Props {
  images: { url: string; productName: string }[]
}

export default function ProductGallery({ images }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null)

  const close = () => setLightbox(null)
  const prev = useCallback(() => setLightbox(i => (i! > 0 ? i! - 1 : images.length - 1)), [images.length])
  const next = useCallback(() => setLightbox(i => (i! < images.length - 1 ? i! + 1 : 0)), [images.length])

  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, prev, next])

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setLightbox(idx)}
            className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <Image
              src={img.url}
              alt={img.productName}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={close}
        >
          {/* Close */}
          <button
            onClick={close}
            className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 z-10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm z-10">
            {lightbox + 1} / {images.length}
          </div>

          {/* Prev */}
          <button
            onClick={e => { e.stopPropagation(); prev() }}
            className="absolute left-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 z-10 transition-colors"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          {/* Image */}
          <div
            className="relative w-full h-full max-w-5xl max-h-[90vh] mx-16 my-12"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={images[lightbox].url}
              alt={images[lightbox].productName}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Next */}
          <button
            onClick={e => { e.stopPropagation(); next() }}
            className="absolute right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 z-10 transition-colors"
          >
            <ChevronRight className="w-7 h-7" />
          </button>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] px-2 pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={e => { e.stopPropagation(); setLightbox(idx) }}
                  className={`relative shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === lightbox ? 'border-white scale-110' : 'border-white/30 hover:border-white/60'
                  }`}
                >
                  <Image src={img.url} alt="" fill sizes="56px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
