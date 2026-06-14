import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.scs-uae.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: categories } = await supabase.from('categories').select('slug, created_at').eq('is_active', true)

  const categoryUrls = (categories || []).map((cat) => ({
    url: `${BASE_URL}/products/${cat.slug}`,
    lastModified: cat.created_at,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/products`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    ...categoryUrls,
  ]
}
