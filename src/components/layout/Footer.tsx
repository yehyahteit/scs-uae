import Link from 'next/link'
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react'

const categories = [
  { name: 'Restaurant & Hotel', slug: 'restaurant' },
  { name: 'Medical Uniform', slug: 'medical' },
  { name: 'Facility Management', slug: 'facility' },
  { name: 'Industrial & Safety', slug: 'safety' },
  { name: 'SPA & Salon', slug: 'spa' },
  { name: 'Schools & Nursery', slug: 'school' },
  { name: 'Corporate Uniform', slug: 'corporate' },
  { name: 'Embroidery Services', slug: 'embroidery' },
  { name: 'Printing Services', slug: 'printing' },
]

export default function Footer() {
  return (
    <footer className="bg-[#1a1f5e] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold mb-3 text-white">Smart Corporate Solutions</h3>
            <p className="text-sm text-white/70 leading-relaxed mb-5">
              Premium uniform supplier for all industries in the UAE since 2012. UAE registered company.
            </p>
            <div className="flex gap-3">
              <a
                href="https://api.whatsapp.com/send?phone=971555953901&text=Hello%20SCS%20UAE"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-full hover:bg-[#25D366] transition-colors"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-pink-600 transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-blue-600 transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-bold text-white mb-4 uppercase text-xs tracking-widest">Products</h4>
            <ul className="space-y-2.5">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/products/${cat.slug}`} className="text-white/70 hover:text-white text-sm transition-colors hover:pl-1 duration-200 block">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-white mb-4 uppercase text-xs tracking-widest">Services</h4>
            <ul className="space-y-2.5">
              {categories.slice(5).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/products/${cat.slug}`} className="text-white/70 hover:text-white text-sm transition-colors hover:pl-1 duration-200 block">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services" className="text-white/70 hover:text-white text-sm transition-colors hover:pl-1 duration-200 block">
                  All Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-4 uppercase text-xs tracking-widest">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-white/70">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-white" />
                Dubai, United Arab Emirates
              </li>
              <li>
                <a href="tel:+971555953901" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 text-white" />
                  +971 55 595 3901
                </a>
              </li>
              <li>
                <a href="mailto:info@scs-uae.com" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
                  <Mail className="w-4 h-4 text-white" />
                  info@scs-uae.com
                </a>
              </li>
            </ul>
            <Link href="/contact#quote"
              className="mt-5 inline-block bg-white text-[#1a1f5e] font-bold text-sm py-2.5 px-5 rounded-lg hover:bg-gray-100 transition-colors">
              Get a Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Smart Corporate Solutions F.Z.E L.L.C — All rights reserved.</p>
          <p>UAE Registered Company</p>
        </div>
      </div>
    </footer>
  )
}
