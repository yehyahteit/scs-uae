'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  images: { url: string; productName: string }[]
}

export default function ProductGallery({ images }: Props) {
  const [page, setPage] = useState(0)
  const [nextPage, setNextPage] = useState<number | null>(null)
  const [flipDir, setFlipDir] = useState<'left' | 'right' | null>(null)
  const [flipAngle, setFlipAngle] = useState(0)   // 0 → 180 during flip
  const [isDragging, setIsDragging] = useState(false)
  const [dragAngle, setDragAngle] = useState(0)
  const [thumbPage, setThumbPage] = useState(0)

  const touchStartX = useRef<number | null>(null)
  const bookRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number | null>(null)

  const THUMBS_PER_PAGE = 18
  const total = images.length
  const totalThumbPages = Math.ceil(total / THUMBS_PER_PAGE)
  const thumbStart = thumbPage * THUMBS_PER_PAGE
  const thumbImages = images.slice(thumbStart, thumbStart + THUMBS_PER_PAGE)
  const progress = total > 1 ? (page / (total - 1)) * 100 : 100

  // Animate flip programmatically
  const animateFlip = useCallback((dir: 'left' | 'right', targetPage: number) => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    setFlipDir(dir)
    setNextPage(targetPage)
    setFlipAngle(0)

    const start = performance.now()
    const duration = 420

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      // Ease in-out cubic
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      setFlipAngle(eased * 180)

      if (t < 1) {
        animRef.current = requestAnimationFrame(tick)
      } else {
        setPage(targetPage)
        setNextPage(null)
        setFlipDir(null)
        setFlipAngle(0)
        setThumbPage(Math.floor(targetPage / THUMBS_PER_PAGE))
      }
    }
    animRef.current = requestAnimationFrame(tick)
  }, [THUMBS_PER_PAGE])

  const goTo = useCallback((idx: number, dir: 'left' | 'right') => {
    if (idx < 0 || idx >= total || flipDir) return
    animateFlip(dir, idx)
  }, [total, flipDir, animateFlip])

  const prev = useCallback(() => goTo(page - 1, 'left'), [page, goTo])
  const next = useCallback(() => goTo(page + 1, 'right'), [page, goTo])

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next])

  // Touch swipe with live drag angle
  const onTouchStart = (e: React.TouchEvent) => {
    if (flipDir) return
    touchStartX.current = e.touches[0].clientX
    setIsDragging(true)
    setDragAngle(0)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    if (!isDragging || touchStartX.current === null) return
    const dx = e.touches[0].clientX - touchStartX.current
    const bookW = bookRef.current?.offsetWidth || 800
    // Map drag distance to angle (max 60deg while dragging)
    const angle = Math.min(Math.abs(dx) / bookW * 120, 60)
    setDragAngle(dx < 0 ? -angle : angle)
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging || touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    setIsDragging(false)
    setDragAngle(0)
    touchStartX.current = null

    if (dx < -50 && page < total - 1) next()
    else if (dx > 50 && page > 0) prev()
  }

  // Current page transform during programmatic flip
  const getFlipStyle = () => {
    if (!flipDir) return {}
    // During flip: current page rotates away
    const half = flipAngle < 90
    const angle = flipDir === 'right'
      ? -flipAngle          // page turns left (next page)
      : flipAngle           // page turns right (prev page)
    const origin = flipDir === 'right' ? 'left center' : 'right center'

    return {
      transform: `perspective(1200px) rotateY(${angle}deg)`,
      transformOrigin: origin,
      transition: 'none',
      zIndex: half ? 10 : 5,
    }
  }

  // Drag style for live feedback
  const getDragStyle = () => {
    if (!isDragging || dragAngle === 0) return {}
    return {
      transform: `perspective(1200px) rotateY(${dragAngle * 0.4}deg) scale(0.98)`,
      transformOrigin: dragAngle < 0 ? 'left center' : 'right center',
      transition: 'none',
    }
  }

  const img = images[page]
  const nextImg = nextPage !== null ? images[nextPage] : null

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full select-none">

      {/* Thumbnail sidebar */}
      <div className="lg:w-64 xl:w-72 shrink-0 flex flex-col gap-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest hidden lg:block">
          {total} Photos
        </p>
        <div className="grid grid-cols-6 lg:grid-cols-3 gap-2">
          {thumbImages.map((t, i) => {
            const idx = thumbStart + i
            return (
              <button
                key={idx}
                onClick={() => goTo(idx, idx > page ? 'right' : 'left')}
                className={`relative rounded-xl overflow-hidden border-2 transition-all duration-200 group
                  ${idx === page
                    ? 'border-primary shadow-lg scale-[1.04]'
                    : 'border-gray-200 hover:border-primary/50 hover:shadow-md'
                  }`}
                style={{ aspectRatio: '1' }}
              >
                <Image src={t.url} alt="" fill sizes="90px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                <span className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1 rounded leading-4">{idx + 1}</span>
              </button>
            )
          })}
        </div>
        {totalThumbPages > 1 && (
          <div className="flex items-center justify-between mt-1">
            <button onClick={() => setThumbPage(p => Math.max(0, p - 1))} disabled={thumbPage === 0}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-gray-400">{thumbPage + 1} / {totalThumbPages}</span>
            <button onClick={() => setThumbPage(p => Math.min(totalThumbPages - 1, p + 1))} disabled={thumbPage === totalThumbPages - 1}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Book */}
      <div className="flex-1 flex flex-col gap-3">
        <div
          ref={bookRef}
          className="relative w-full"
          style={{ perspective: '1800px' }}
        >
          {/* Book container */}
          <div
            className="relative w-full rounded-2xl overflow-hidden"
            style={{
              aspectRatio: '4/3',
              boxShadow: '12px 12px 40px rgba(0,0,0,0.22), -3px 3px 12px rgba(0,0,0,0.08)',
              background: '#f0f0f0',
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Underneath / incoming page (shown during flip) */}
            {nextImg && (
              <div className="absolute inset-0">
                <Image src={nextImg.url} alt="" fill sizes="800px" className="object-cover" />
              </div>
            )}

            {/* Current page (rotates away during flip) */}
            <div
              className="absolute inset-0"
              style={flipDir ? getFlipStyle() : getDragStyle()}
            >
              <Image src={img.url} alt={img.productName} fill sizes="800px" className="object-cover" priority />

              {/* Spine shadow */}
              <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
              {/* Page edge highlight */}
              <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-l from-black/10 to-transparent pointer-events-none" />

              {/* Fold crease — appears when flipping */}
              {(flipDir || isDragging) && (
                <div
                  className="absolute inset-y-0 pointer-events-none"
                  style={{
                    width: '4px',
                    background: 'linear-gradient(to right, rgba(0,0,0,0.15), rgba(0,0,0,0.05), transparent)',
                    left: flipDir === 'right' || dragAngle < 0 ? '0' : 'auto',
                    right: flipDir === 'left' || dragAngle > 0 ? '0' : 'auto',
                  }}
                />
              )}
            </div>

            {/* Page counter */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 bg-black/55 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">
              {page + 1} / {total}
            </div>

            {/* Nav buttons */}
            <button onClick={prev} disabled={page === 0 || !!flipDir}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-700 rounded-full p-2.5 shadow-lg border border-gray-100 disabled:opacity-0 transition-all hover:scale-110">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={next} disabled={page === total - 1 || !!flipDir}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-700 rounded-full p-2.5 shadow-lg border border-gray-100 disabled:opacity-0 transition-all hover:scale-110">
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Click zones */}
            <button onClick={prev} disabled={page === 0 || !!flipDir}
              className="absolute left-0 inset-y-0 w-1/3 z-10 cursor-w-resize disabled:cursor-default" />
            <button onClick={next} disabled={page === total - 1 || !!flipDir}
              className="absolute right-0 inset-y-0 w-1/3 z-10 cursor-e-resize disabled:cursor-default" />

            {/* Page curl corner */}
            <div className="absolute bottom-0 right-0 w-10 h-10 pointer-events-none z-20"
              style={{
                background: 'linear-gradient(225deg, #e5e7eb 45%, rgba(0,0,0,0.1) 50%, transparent 55%)',
                borderBottomRightRadius: '1rem',
              }}
            />
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <p className="text-xs text-gray-400 text-center">
          Swipe or use <kbd className="px-1.5 py-0.5 bg-gray-100 rounded font-mono text-[11px]">←</kbd>{' '}
          <kbd className="px-1.5 py-0.5 bg-gray-100 rounded font-mono text-[11px]">→</kbd> to flip pages
        </p>
      </div>
    </div>
  )
}
