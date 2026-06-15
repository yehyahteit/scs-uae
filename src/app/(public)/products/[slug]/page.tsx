import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import type { Metadata } from 'next'
import ProductGallery from './ProductGallery'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface Props { params: { slug: string } }

function makeClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await makeClient()
    .from('products')
    .select('name, description')
    .eq('slug', params.slug)
    .single()
  if (!data) return { title: 'Product Not Found' }
  const p = data as any
  return { title: p.name, description: p.description ?? undefined }
}

export default async function ProductPage({ params }: Props) {
  const { data: productRaw } = await makeClient()
    .from('products')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!productRaw) notFound()
  const product = productRaw as any
  const images: string[] = product.images || []
  const galleryImages = images.map((url: string) => ({ url, productName: product.name }))

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

      {/* Hero */}
      <section className="relative bg-primary text-white py-8 overflow-hidden">
        {images[0] && (
          <Image src={images[0]} alt={product.name} fill sizes="100vw" className="object-cover opacity-20" />
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {product.is_featured && (
            <span className="inline-block bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">Featured</span>
          )}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>
          {product.description && (
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">{product.description}</p>
          )}
        </div>
      </section>

      {/* Gallery */}
      {galleryImages.length > 0 && (
        <section className="py-4 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProductGallery images={galleryImages} />
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/products" className="text-primary font-semibold hover:underline">← Back to All Products</Link>
          <Link href="/contact#quote" className="btn-accent">Get a Free Quote</Link>
        </div>
      </section>
    </>
  )
}
