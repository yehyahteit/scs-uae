import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Metadata } from 'next'
import ProductGallery from './ProductGallery'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: cat } = await supabase.from('categories').select('name, description').eq('slug', params.slug).single()
  if (!cat) return { title: 'Category Not Found' }
  const catData = cat as { name: string; description: string | null }
  return { title: catData.name, description: catData.description ?? undefined }
}

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  is_active: boolean
}

export default async function CategoryPage({ params }: Props) {
  const { data: categoryRaw } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single()

  if (!categoryRaw) notFound()
  const category = categoryRaw as unknown as Category

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', category.id)
    .eq('is_active', true)
    .order('sort_order')

  const allImages: { url: string; productName: string }[] = []
  if (products) {
    for (const product of products) {
      for (const img of product.images || []) {
        allImages.push({ url: img, productName: product.name })
      }
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary text-white py-20 overflow-hidden">
        {category.image_url && (
          <Image src={category.image_url} alt={category.name} fill sizes="100vw" className="object-cover opacity-20" />
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/60 text-sm font-semibold uppercase tracking-widest mb-2">Products</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">{category.description}</p>
          )}
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {allImages.length > 0 ? (
            <ProductGallery images={allImages} />
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 mb-2 text-lg">Our {category.name} collection includes:</p>
              <p className="text-primary font-medium text-lg mb-8">{category.description}</p>
              <Link href="/contact#quote" className="btn-primary">Request a Quote</Link>
            </div>
          )}
        </div>
      </section>

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
