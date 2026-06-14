import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Custom embroidery, printing, design, and uniform production services from Smart Corporate Solutions UAE.',
}

const services = [
  {
    name: 'Custom Uniform Design',
    desc: 'Our in-house design team works closely with you to create uniforms that perfectly represent your brand identity. From concept to final approval, we handle every detail.',
    icon: '🎨',
  },
  {
    name: 'Embroidery Services',
    desc: 'Professional embroidery on fabrics, hats, and more. We offer 3D, flat, patch, and woven patch embroidery with precision and durability.',
    icon: '🧵',
  },
  {
    name: 'HTV & Sublimation Printing',
    desc: 'Smooth, puff, reflective, glitter, foil, flock, and metal vinyl printing on uniforms, hats, ceramics, metals, and stickers.',
    icon: '🖨️',
  },
  {
    name: 'Bulk Manufacturing',
    desc: 'We manufacture uniforms at scale for large organizations — hotels, hospitals, schools, and corporations — with consistent quality across every piece.',
    icon: '🏭',
  },
  {
    name: 'Express Production',
    desc: 'Tight deadline? Our express production service ensures your order is fulfilled on time without compromising quality.',
    icon: '⚡',
  },
  {
    name: 'Custom Sizing',
    desc: 'We accommodate any size range, including custom measurements, to ensure a perfect fit for every team member.',
    icon: '📐',
  },
]

export default function ServicesPage() {
  return (
    <>
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Beyond uniforms — we offer end-to-end solutions from design to delivery.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {services.map((svc) => (
              <div key={svc.name} className="card p-7">
                <div className="text-4xl mb-4">{svc.icon}</div>
                <h3 className="text-xl font-bold text-primary mb-3">{svc.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title mb-4">Our Process</h2>
          <p className="section-subtitle mx-auto mb-10">Simple, transparent, and efficient.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Consultation', 'Design', 'Production', 'Delivery'].map((step, i) => (
              <div key={step} className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary text-white font-bold text-xl flex items-center justify-center mx-auto mb-3">
                  {i + 1}
                </div>
                <p className="font-semibold text-primary">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-accent text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Start Your Order Today</h2>
          <p className="text-white/80 mb-6">Contact us and our team will guide you through every step.</p>
          <Link href="/contact#quote" className="bg-white text-accent font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors inline-block">
            Request a Quote
          </Link>
        </div>
      </section>
    </>
  )
}
