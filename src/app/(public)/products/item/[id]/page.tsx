'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Image from 'next/image'
import Link from 'next/link'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<any>(null)
  const [activeImg, setActiveImg] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    client.from('products').select('*').eq('id', id).single().then(({ data }) => {
      setProduct(data)
      setLoading(false)
    })
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-500">
      <p>Product not found.</p>
      <Link href="/products" className="btn-primary">Back to Products</Link>
    </div>
  )

  const images: string[] = product.images || []

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-gray-500 flex items-center gap-2">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary">Products</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Image gallery */}
            <div>
              {images.length > 0 ? (
                <>
                  <div className="relative w-full rounded-2xl overflow-hidden bg-gray-100 mb-4" style={{ aspectRatio: '4/3' }}>
                    <Image
                      src={images[activeImg]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                      priority
                    />
                    {product.is_featured && (
                      <span className="absolute top-4 left-4 bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full">Featured</span>
                    )}
                  </div>
                  {images.length > 1 && (
                    <div className="grid grid-cols-5 gap-2">
                      {images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImg(i)}
                          className={`relative rounded-lg overflow-hidden border-2 transition-all ${i === activeImg ? 'border-primary' : 'border-transparent hover:border-gray-300'}`}
                          style={{ aspectRatio: '1' }}
                        >
                          <Image src={img} alt={`${product.name} ${i + 1}`} fill sizes="80px" className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300" style={{ aspectRatio: '4/3' }}>
                  No images available
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              {product.description && (
                <p className="text-gray-600 text-lg leading-relaxed mb-8">{product.description}</p>
              )}

              <div className="mt-auto space-y-3">
                <Link href="/contact#quote" className="btn-primary w-full justify-center text-center block">
                  Request a Quote
                </Link>
                <Link href="/contact" className="btn-secondary w-full justify-center text-center block">
                  Contact Us
                </Link>
              </div>

              <div className="mt-8 p-4 bg-gray-50 rounded-xl text-sm text-gray-500">
                <p>📞 Need help? Call us or send a message — we respond within 24 hours.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-primary text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to order?</h2>
          <p className="text-gray-300 mb-6">Get a free quote for custom uniforms tailored to your needs.</p>
          <Link href="/contact#quote" className="btn-accent">Get a Free Quote</Link>
        </div>
      </section>
    </>
  )
}
