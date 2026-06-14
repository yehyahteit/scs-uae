import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse our full range of uniform products for restaurants, hotels, medical, corporate, schools, spa, industrial, and more.',
}

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
}

export default async function ProductsPage() {
  const { data: categoriesRaw } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  const categories = (categoriesRaw as unknown as Category[]) || []

  return (
    <>
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
          <p className="text-gray-300 text-lg">Premium uniforms for every industry</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {categories?.map((cat) => (
              <Link key={cat.id} href={`/products/${cat.slug}`} className="card group">
                <div className="relative h-56 overflow-hidden">
                  {cat.image_url && (
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-white font-bold text-lg">{cat.name}</h2>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 text-sm leading-relaxed">{cat.description}</p>
                  <span className="mt-3 inline-flex items-center text-primary font-semibold text-sm hover:text-primary-dark">
                    View Collection →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-primary text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Can&rsquo;t find what you need?</h2>
          <p className="text-gray-300 mb-6">We offer custom designs — contact us to discuss your requirements.</p>
          <Link href="/contact#quote" className="btn-accent">Request a Custom Quote</Link>
        </div>
      </section>
    </>
  )
}
