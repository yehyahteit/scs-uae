'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabaseBrowser } from '@/lib/supabase-browser'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products', hasDropdown: true },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

// Categories admin page is merged into Products — no separate nav link needed

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([])
  const pathname = usePathname()

  useEffect(() => {
    supabaseBrowser()
      .from('categories')
      .select('name, slug')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data }) => { if (data) setCategories(data) })
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image
              src="/logo.svg"
              alt="SCS UAE Logo"
              width={140}
              height={54}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      'flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                      pathname.startsWith('/products') || pathname.startsWith('/categories')
                        ? 'text-primary bg-primary/10'
                        : 'text-gray-700 hover:text-primary hover:bg-gray-100'
                    )}
                  >
                    {link.label}
                    <ChevronDown className="w-4 h-4" />
                  </Link>
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 w-56 bg-white shadow-xl rounded-xl py-2 border border-gray-100">
                      {categories.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/products/${cat.slug}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-700 hover:text-primary hover:bg-gray-100'
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
            <Link href="/contact#quote" className="ml-2 btn-primary text-sm py-2 px-4">
              Get a Quote
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 mt-1">
            {navLinks.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  className="block px-4 py-3 text-gray-700 hover:text-primary font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
                {link.hasDropdown && (
                  <div className="pl-6 border-l-2 border-primary/20 ml-4">
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/products/${cat.slug}`}
                        className="block py-2 px-2 text-sm text-gray-600 hover:text-primary"
                        onClick={() => setIsOpen(false)}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              href="/contact#quote"
              className="block mx-4 mt-3 btn-primary text-center"
              onClick={() => setIsOpen(false)}
            >
              Get a Quote
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
