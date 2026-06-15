'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  images: { url: string; productName: string }[]
}

export default function ProductGallery({ images }: Props) {
  const [page, setPage] = useState(0)
  const [flipping, setFlipping] = useState<'left' | 'right' | null>(null)
  const [thumbStart, setThumbStart] = useState(0)

  const total = images.length
  const THUMBS_VISIBLE = 8

  const goTo = useCallback((idx: number, dir: 'left' | 'right') => {
    if (idx < 0 || idx >= total || flipping) return
    setFlipping(dir)
    setTimeout(() => {
      setPage(idx)
      setFlipping(null)
      // Keep thumb strip centered
      const newStart = Math.max(0, Math.min(idx - Math.floor(THUMBS_VISIBLE / 2), total - THUMBS_VISIBLE))
      setThumbStart(newStart)
    }, 280)
  }, [total, flipping])

  const prev = useCallback(() => goTo(page - 1, 'left'), [page, goTo])
  const next = useCallback(() => goTo(page + 1, 'right'), [page, goTo])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next])

  const img = images[page]
  const progress = total > 1 ? (page / (total - 1)) * 100 : 100

  return (
    <div className="flex flex-col items-center gap-6 select-none">

      {/* Book viewer */}
      <div className="relative w-full max-w-lg">

        {/* Book shadow + border */}
        <div
          className="relative mx-auto rounded-2xl overflow-hidden bg-white"
          style={{
            boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(0,0,0,0.06)',
            aspectRatio: '3/4',
            maxHeight: '80vh',
          }}
        >
          {/* Page flip animation wrapper */}
          <div
            className="w-full h-full transition-all duration-300"
            style={{
              transform: flipping === 'right'
                ? 'perspective(1200px) rotateY(-4deg) scale(0.97)'
                : flipping === 'left'
                ? 'perspective(1200px) rotateY(4deg) scale(0.97)'
                : 'perspective(1200px) rotateY(0deg) scale(1)',
              transformOrigin: flipping === 'right' ? 'left center' : 'right center',
              opacity: flipping ? 0.75 : 1,
            }}
          >
            <Image
              key={page}
              src={img.url}
              alt={img.productName}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-contain"
              priority
            />
          </div>

          {/* Left click zone */}
          <button
            onClick={prev}
            disabled={page === 0 || !!flipping}
            className="absolute left-0 inset-y-0 w-1/3 z-20 flex items-center justify-start pl-4 group cursor-w-resize disabled:cursor-default"
            aria-label="Previous"
          >
            <div className={`bg-black/50 hover:bg-black/70 text-white rounded-full p-2.5 transition-all shadow-lg
              ${page === 0 ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
              <ChevronLeft className="w-6 h-6" />
            </div>
          </button>

          {/* Right click zone */}
          <button
            onClick={next}
            disabled={page === total - 1 || !!flipping}
            className="absolute right-0 inset-y-0 w-1/3 z-20 flex items-center justify-end pr-4 group cursor-e-resize disabled:cursor-default"
            aria-label="Next"
          >
            <div className={`bg-black/50 hover:bg-black/70 text-white rounded-full p-2.5 transition-all shadow-lg
              ${page === total - 1 ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
              <ChevronRight className="w-6 h-6" />
            </div>
          </button>

          {/* Page number badge */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-black/60 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">
            {page + 1} / {total}
          </div>
        </div>

        {/* Corner curl hint */}
        <div className="absolute bottom-0 right-0 w-10 h-10 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.06) 50%)',
            borderBottomRightRadius: '1rem',
          }}
        />
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-lg h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Thumbnail strip */}
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setThumbStart(s => Math.max(0, s - 1))}
            disabled={thumbStart === 0}
            className="shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-700 disabled:opacity-20 transition-opacity"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex gap-2 flex-1 overflow-hidden">
            {images.slice(thumbStart, thumbStart + THUMBS_VISIBLE).map((img, i) => {
              const idx = thumbStart + i
              return (
                <button
                  key={idx}
                  onClick={() => goTo(idx, idx > page ? 'right' : 'left')}
                  className={`relative shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200
                    ${idx === page
                      ? 'border-primary shadow-md scale-105'
                      : 'border-transparent hover:border-gray-300 opacity-60 hover:opacity-100'
                    }`}
                  style={{ width: `calc(${100 / THUMBS_VISIBLE}% - 6px)`, aspectRatio: '1' }}
                  aria-label={`Go to image ${idx + 1}`}
                >
                  <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
                </button>
              )
            })}
          </div>

          <button
            onClick={() => setThumbStart(s => Math.min(total - THUMBS_VISIBLE, s + 1))}
            disabled={thumbStart + THUMBS_VISIBLE >= total}
            className="shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-700 disabled:opacity-20 transition-opacity"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Keyboard hint */}
      <p className="text-xs text-gray-400">
        Use <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-mono text-xs">←</kbd>{' '}
        <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-mono text-xs">→</kbd>{' '}
        arrow keys or click the sides to flip pages
      </p>
    </div>
  )
}
