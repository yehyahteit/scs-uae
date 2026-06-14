import type { Metadata } from 'next'
import ContactForm from '@/components/ui/ContactForm'
import QuoteForm from '@/components/ui/QuoteForm'
import { Mail, Phone, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Smart Corporate Solutions UAE. Request a quote or send us a message.',
}

export default function ContactPage() {
  return (
    <>
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-300 text-lg">We&rsquo;d love to hear from you. Let&rsquo;s talk uniforms.</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-primary mb-5">Get In Touch</h2>
                <div className="space-y-4">
                  <div className="flex gap-3 items-start">
                    <MapPin className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                    <p className="text-gray-600">Dubai, United Arab Emirates</p>
                  </div>
                  <div className="flex gap-3 items-center">
                    <Phone className="w-5 h-5 text-accent shrink-0" />
                    <a href="tel:+971555953901" className="text-gray-600 hover:text-primary">+971 55 595 3901</a>
                  </div>
                  <div className="flex gap-3 items-center">
                    <Mail className="w-5 h-5 text-accent shrink-0" />
                    <a href="mailto:info@scs-uae.com" className="text-gray-600 hover:text-primary">info@scs-uae.com</a>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-primary mb-3">WhatsApp Us</h3>
                <p className="text-sm text-gray-600 mb-4">Fastest way to reach us — message us directly on WhatsApp.</p>
                <a
                  href="https://api.whatsapp.com/send?phone=971555953901&text=Hello%20SCS%20UAE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact form */}
              <div className="bg-white rounded-xl p-7 shadow-sm" id="contact">
                <h2 className="text-xl font-bold text-primary mb-6">Send a Message</h2>
                <ContactForm />
              </div>

              {/* Quote form */}
              <div className="bg-white rounded-xl p-7 shadow-sm" id="quote">
                <h2 className="text-xl font-bold text-primary mb-2">Request a Quote</h2>
                <p className="text-gray-500 text-sm mb-6">Fill in your requirements and we&rsquo;ll send you a custom quote within 24 hours.</p>
                <QuoteForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
