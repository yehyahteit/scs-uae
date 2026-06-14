import Image from 'next/image'
import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse our full range of uniform products for restaurants, hotels, medical, corporate, schools, spa, industrial, and more.',
}

export default async function ProductsPage() {
  const { data: productsRaw } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const products = (productsRaw as any[]) || []

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
          {products.length === 0 ? (
            <div className="text-center py-20 text-gray-400">No products found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {products.map((product: any) => (
                <div key={product.id} className="card group flex flex-col h-full">
                  <div className="relative h-60 overflow-hidden shrink-0">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300 text-sm">No image</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    {product.is_featured && (
                      <span className="absolute top-3 left-3 bg-accent text-white text-xs font-semibold px-2 py-1 rounded-full">Featured</span>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h2 className="text-gray-900 font-bold text-lg mb-2">{product.name}</h2>
                    {product.description && (
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 flex-1">{product.description}</p>
                    )}
                    <Link href="/contact#quote" className="mt-4 inline-flex items-center text-primary font-semibold text-sm hover:text-primary-dark">
                      Request a Quote →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
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
