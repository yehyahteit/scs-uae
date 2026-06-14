'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, Star, ArrowRight, ChevronLeft, ChevronRight, ArrowDown, Phone, Mail, MapPin } from 'lucide-react'
import { supabaseBrowser } from '@/lib/supabase-browser'

// ── DATA ─────────────────────────────────────────────────────────
const heroSlides = [
  {
    image: 'https://static.wixstatic.com/media/bf2fa2_c2bbf84b937d4f04be53381926ed90a0~mv2.jpeg',
    title: 'Smart Corporate',
    highlight: 'Solutions',
    subtitle: 'Premium uniform supplier for all industries in the UAE since 2012',
    cta: 'Explore Products',
    href: '/products',
  },
  {
    image: 'https://static.wixstatic.com/media/bf2fa2_5e5ca697bd6549b7b627dd3724857939~mv2.jpeg',
    title: 'Hotel & Restaurant',
    highlight: 'Uniforms',
    subtitle: 'Elegant workwear that represents your brand perfectly',
    cta: 'View Collection',
    href: '/products/restaurant',
  },
  {
    image: 'https://static.wixstatic.com/media/bf2fa2_d6b7ceab6fcb422b9d6154a639bc4f49~mv2.jpeg',
    title: 'Medical &',
    highlight: 'Healthcare',
    subtitle: 'Professional medical uniforms crafted for comfort and functionality',
    cta: 'View Collection',
    href: '/products/medical',
  },
  {
    image: 'https://static.wixstatic.com/media/bf2fa2_54cf1fcd1e6f48d685021eab3fe9ee1a~mv2.jpeg',
    title: 'Corporate',
    highlight: 'Workwear',
    subtitle: 'Tailored corporate uniforms that make a lasting impression',
    cta: 'View Collection',
    href: '/products/corporate',
  },
  {
    image: 'https://static.wixstatic.com/media/bf2fa2_ea3e8a6af56b4d3e89a87fd4490d9ecc~mv2.jpeg',
    title: 'Industrial &',
    highlight: 'Safety Gear',
    subtitle: 'High-visibility and safety-certified workwear for every environment',
    cta: 'View Collection',
    href: '/products/safety',
  },
]



const testimonials = [
  { name: 'Amanda Johns', role: 'COO', text: "It's always a pleasure to work with SCS and their team. They are personable, responsive, and results-oriented!", rating: 5 },
  { name: 'Mohammed Al Rashid', role: 'Operations Manager', text: "Outstanding quality and fast turnaround. SCS has been our go-to uniform supplier for 3 years running.", rating: 5 },
  { name: 'Sarah Williams', role: 'HR Director', text: "Professional service from start to finish. Our entire team loves their new uniforms. Highly recommended!", rating: 5 },
]



// ── HOOK: Intersection Observer for scroll animations ─────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

// ── COMPONENTS ───────────────────────────────────────────────────

function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, inView } = useInView()
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

// ── HERO CAROUSEL ────────────────────────────────────────────────
function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)
  const animatingRef = useRef(false)

  const go = (dir: 'next' | 'prev') => {
    if (animatingRef.current) return
    animatingRef.current = true
    setAnimating(true)
    setCurrent(c => dir === 'next' ? (c + 1) % heroSlides.length : (c - 1 + heroSlides.length) % heroSlides.length)
    setTimeout(() => { animatingRef.current = false; setAnimating(false) }, 700)
  }

  useEffect(() => {
    const t = setInterval(() => go('next'), 5000)
    return () => clearInterval(t)
  }, []) // runs once — go() uses ref so no stale closure

  const slide = heroSlides[current]

  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden">
      {/* Background images */}
      {heroSlides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image src={s.image} alt={s.title} fill className="object-cover" priority={i === 0} />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
          <div key={current} className="max-w-2xl animate-fadeInUp">
            <div className="inline-flex items-center gap-2 bg-primary/80 backdrop-blur-sm text-white text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-white/20">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              UAE&rsquo;s Premier Uniform Supplier Since 2012
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-4">
              {slide.title}{' '}
              <span className="text-white relative">
                {slide.highlight}
                <span className="absolute -bottom-1 left-0 right-0 h-2 bg-primary rounded-full opacity-80" />
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed">{slide.subtitle}</p>
            <div className="flex flex-wrap gap-4">
              <Link href={slide.href} className="group flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-primary/50 hover:scale-105">
                {slide.cta}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/contact#quote" className="flex items-center gap-2 bg-white/15 backdrop-blur-sm hover:bg-white/25 text-white font-bold px-8 py-4 rounded-xl border border-white/30 transition-all duration-300 hover:scale-105">
                Get a Free Quote
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button onClick={() => go('prev')} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/15 backdrop-blur-sm hover:bg-primary border border-white/20 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={() => go('next')} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/15 backdrop-blur-sm hover:bg-primary border border-white/20 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {heroSlides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? 'w-8 h-3 bg-primary' : 'w-3 h-3 bg-white/50 hover:bg-white'}`} />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 flex flex-col items-center gap-1 text-white/60 text-xs animate-bounce">
        <ArrowDown className="w-4 h-4" />
        <span>Scroll</span>
      </div>
    </section>
  )
}

const DEFAULT_STATS = [
  { id: '1', value: '2012', label: 'Founded' },
  { id: '2', value: '500+', label: 'Projects Delivered' },
  { id: '3', value: '100+', label: 'Happy Clients' },
  { id: '4', value: '9+', label: 'Product Categories' },
]

// ── COUNT-UP HOOK ─────────────────────────────────────────────────
function useCountUp(rawValue: string, active: boolean, duration = 1800) {
  const [display, setDisplay] = useState('0')
  useEffect(() => {
    if (!active) return
    // Parse numeric part and suffix (e.g. "500+" → 500, "+")
    const match = rawValue.match(/^(\d+)(.*)$/)
    if (!match) { setDisplay(rawValue); return }
    const target = parseInt(match[1], 10)
    const suffix = match[2]
    const start = performance.now()
    const frame = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const val = Math.round(eased * target)
      const formatted = (target >= 1900 && target <= 2100) ? String(val) : val.toLocaleString()
      setDisplay(formatted + suffix)
      if (progress < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [active, rawValue, duration])
  return display
}

function StatItem({ value, label, inView, delay }: { value: string; label: string; inView: boolean; delay: number }) {
  const display = useCountUp(value, inView)
  return (
    <div
      className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ transitionDelay: `${delay}ms` }}>
      <p className="text-3xl md:text-4xl font-extrabold text-white tabular-nums">{inView ? display : '0'}</p>
      <p className="text-white/70 text-sm mt-1 font-medium">{label}</p>
    </div>
  )
}

// ── STATS BAR ────────────────────────────────────────────────────
function StatsBar() {
  const { ref, inView } = useInView()
  const [stats, setStats] = useState<any[]>(DEFAULT_STATS)

  useEffect(() => {
    supabaseBrowser()
      .from('site_stats')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data }) => { if (data && data.length > 0) setStats(data) })
  }, [])

  return (
    <div ref={ref} className="bg-primary text-white py-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((s, i) => (
          <StatItem key={s.id} value={s.value} label={s.label} inView={inView} delay={i * 150} />
        ))}
      </div>
    </div>
  )
}

// ── CATEGORY CAROUSEL ────────────────────────────────────────────
function CategoryCarousel() {
  const [cats, setCats] = useState<any[]>([])
  const [start, setStart] = useState(0)
  const visible = 4

  useEffect(() => {
    supabaseBrowser()
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data }) => setCats(data || []))
  }, [])

  const canPrev = start > 0
  const canNext = start + visible < cats.length

  return (
    <section className="py-24 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-14">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-2">What We Offer</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-accent mb-4">Our Product Range</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">Premium uniforms crafted for every industry across the UAE</p>
        </AnimatedSection>

        <div className="relative">
          {/* Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 transition-all duration-500 items-stretch">
            {cats.slice(start, start + visible).map((cat, i) => (
              <AnimatedSection key={cat.slug} delay={i * 80} className="h-full">
                <Link href={`/products/${cat.slug}`} className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-400 hover:-translate-y-2">
                  <div className="relative h-60 shrink-0 overflow-hidden">
                    {cat.image_url ? (
                      <Image src={cat.image_url} alt={cat.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary/40 text-4xl">🏭</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-bold text-sm leading-tight">{cat.name}</h3>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-gray-500 text-xs flex-1 line-clamp-3">{cat.description}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-primary text-xs font-semibold group-hover:gap-2 transition-all">
                      View Collection <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          {/* Nav buttons */}
          {cats.length > visible && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <button onClick={() => setStart(s => s - 1)} disabled={!canPrev}
                className="w-10 h-10 rounded-full border-2 border-primary text-primary flex items-center justify-center disabled:opacity-30 hover:bg-primary hover:text-white transition-all">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {Array.from({ length: Math.ceil(cats.length / visible) }).map((_, i) => (
                  <button key={i} onClick={() => setStart(i * visible)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${Math.floor(start / visible) === i ? 'bg-primary w-6' : 'bg-gray-300 hover:bg-primary/50'}`} />
                ))}
              </div>
              <button onClick={() => setStart(s => s + 1)} disabled={!canNext}
                className="w-10 h-10 rounded-full border-2 border-primary text-primary flex items-center justify-center disabled:opacity-30 hover:bg-primary hover:text-white transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/products" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg">
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

const DEFAULT_WHY_US = [
  { id: '1', icon: '🏆', title: 'Top Quality', description: 'Exceptional attention to detail in every garment we produce.' },
  { id: '2', icon: '💰', title: 'Best Prices', description: 'Competitive and fair pricing for orders of all sizes.' },
  { id: '3', icon: '📦', title: 'Any Order Size', description: 'From single pieces to thousands — we handle it all.' },
  { id: '4', icon: '⚡', title: 'Express Delivery', description: 'Meeting deadlines with express production capabilities.' },
  { id: '5', icon: '😊', title: 'High Satisfaction', description: 'Hundreds of happy clients across the UAE and beyond.' },
  { id: '6', icon: '🎨', title: 'In-House Design', description: 'Superb design and production facilities under one roof.' },
]

// ── WHY CHOOSE US ────────────────────────────────────────────────
function WhyUs() {
  const [items, setItems] = useState<any[]>(DEFAULT_WHY_US)

  useEffect(() => {
    supabaseBrowser()
      .from('why_us')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data }) => { if (data && data.length > 0) setItems(data) })
  }, [])

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-14">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-2">Our Promise</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-accent mb-4">Why Choose SCS?</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">We go beyond just supplying uniforms — we deliver an experience</p>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {items.map((item, i) => (
            <AnimatedSection key={item.id} delay={i * 80} className="h-full">
              <div className="group h-full p-7 rounded-2xl border-2 border-gray-100 hover:border-primary hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white flex flex-col">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-accent mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1">{item.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── IMAGE MARQUEE ────────────────────────────────────────────────
const marqueeImages = [
  'https://static.wixstatic.com/media/bf2fa2_c2bbf84b937d4f04be53381926ed90a0~mv2.jpeg',
  'https://static.wixstatic.com/media/bf2fa2_5e5ca697bd6549b7b627dd3724857939~mv2.jpeg',
  'https://static.wixstatic.com/media/bf2fa2_9a3c13cdf5a84a4ea8eb115b441331a3~mv2.jpeg',
  'https://static.wixstatic.com/media/bf2fa2_d6b7ceab6fcb422b9d6154a639bc4f49~mv2.jpeg',
  'https://static.wixstatic.com/media/bf2fa2_261cdaa2b8284d5cbc5e626ebe9f459d~mv2.jpeg',
  'https://static.wixstatic.com/media/bf2fa2_ea3e8a6af56b4d3e89a87fd4490d9ecc~mv2.jpeg',
  'https://static.wixstatic.com/media/bf2fa2_aaec700f92234f708a028eaf0e42bb18~mv2.jpeg',
  'https://static.wixstatic.com/media/bf2fa2_0ec2c06a7a964bc1a54a72ebf5e6f468~mv2.jpeg',
]

function ImageMarquee() {
  return (
    <section className="py-6 bg-gray-100 overflow-hidden">
      <div className="flex gap-4 animate-marquee whitespace-nowrap">
        {[...marqueeImages, ...marqueeImages].map((src, i) => (
          <div key={i} className="shrink-0 w-56 h-36 rounded-xl overflow-hidden shadow-sm">
            <Image src={src} alt="" width={224} height={144} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
          </div>
        ))}
      </div>
    </section>
  )
}

// ── TESTIMONIALS CAROUSEL ────────────────────────────────────────
function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % testimonials.length), 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="py-24 bg-accent text-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <AnimatedSection>
          <p className="text-primary-light font-semibold text-sm uppercase tracking-widest mb-2">Testimonials</p>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-14">What Our Clients Say</h2>
        </AnimatedSection>

        <div className="relative h-56">
          {testimonials.map((t, i) => (
            <div key={i}
              className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${i === current ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-5 h-5 fill-primary-light text-primary-light" />
                ))}
              </div>
              <p className="text-xl md:text-2xl italic text-white/90 max-w-2xl leading-relaxed mb-6">
                &ldquo;{t.text}&rdquo;
              </p>
              <p className="font-bold text-primary-light">{t.name}</p>
              <p className="text-white/60 text-sm">{t.role}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${i === current ? 'w-8 h-3 bg-primary-light' : 'w-3 h-3 bg-white/30 hover:bg-white/60'}`} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CLIENTS MARQUEE ──────────────────────────────────────────────
function ClientsSection() {
  const [clientList, setClientList] = useState<any[]>([])

  useEffect(() => {
    supabaseBrowser()
      .from('clients')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data }) => setClientList(data || []))
  }, [])

  if (clientList.length === 0) return null

  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-12">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-2">Trusted By</p>
          <h2 className="text-4xl font-extrabold text-accent">Our Clients</h2>
        </AnimatedSection>
        <div className="overflow-hidden">
          <div className="flex gap-10 animate-marquee-slow">
            {[...clientList, ...clientList].map((c, i) => (
              <div key={i} className="shrink-0 flex items-center justify-center w-52 h-28 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                {c.logo_url && (
                  <Image src={c.logo_url} alt={c.name} width={180} height={90} className="max-h-20 w-auto object-contain" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── CTA SECTION ──────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <AnimatedSection>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Ready to Elevate Your Team&rsquo;s Look?
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
            Contact us today for a free quote. We deliver quality uniforms for any industry, any size order, anywhere in the UAE.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact#quote"
              className="bg-white text-primary font-bold px-10 py-4 rounded-xl hover:bg-gray-100 transition-all hover:scale-105 shadow-lg">
              Request a Free Quote
            </Link>
            <a href="https://api.whatsapp.com/send?phone=971555953901&text=Hello%20SCS%20UAE"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] text-white font-bold px-10 py-4 rounded-xl hover:bg-green-600 transition-all hover:scale-105 shadow-lg">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp Us
            </a>
          </div>

          {/* Contact info */}
          <div className="flex flex-wrap justify-center gap-8 mt-14 text-white/70 text-sm">
            <a href="tel:+971555953901" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone className="w-4 h-4" /> +971 55 595 3901
            </a>
            <a href="mailto:info@scs-uae.com" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail className="w-4 h-4" /> info@scs-uae.com
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Dubai, UAE
            </span>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

// ── PAGE ─────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <StatsBar />
      <CategoryCarousel />
      <WhyUs />
      <ImageMarquee />
      <TestimonialsCarousel />
      <ClientsSection />
      <CTASection />
    </>
  )
}
