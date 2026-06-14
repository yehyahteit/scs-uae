'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { Mail, Linkedin, Award, Users, Globe, ShieldCheck } from 'lucide-react'
import type { TeamMember } from '@/types/database'

const stats = [
  { value: '12+', label: 'Years of Excellence' },
  { value: '500+', label: 'Happy Clients' },
  { value: '9', label: 'Product Categories' },
  { value: '100%', label: 'UAE Registered' },
]

const values = [
  { icon: Award, title: 'Quality First', desc: 'Premium materials and rigorous quality control on every order.' },
  { icon: Users, title: 'Customer Focus', desc: 'We listen, understand, and deliver beyond expectations.' },
  { icon: Globe, title: 'Global Sourcing', desc: 'Best fabrics and accessories sourced from global suppliers.' },
  { icon: ShieldCheck, title: 'Reliability', desc: 'On-time delivery and consistent supply chain management.' },
]

export default function AboutPage() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loadingTeam, setLoadingTeam] = useState(true)

  useEffect(() => {
    const supabase = supabaseBrowser()
    supabase
      .from('team_members')
      .select('*')
      .order('sort_order')
      .then(({ data, error }) => {
        console.log('team data:', data, 'error:', error)
        setTeam(data || [])
        setLoadingTeam(false)
      })
  }, [])

  return (
    <main>

      {/* Hero */}
      <section className="bg-primary py-20 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-white/60 text-xs font-bold tracking-widest uppercase mb-4">About Us</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Smart Corporate Solutions
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Premium uniform supplier for all industries across the UAE since 2012.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-extrabold text-primary">{s.value}</p>
              <p className="text-gray-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="https://static.wixstatic.com/media/bf2fa2_c2bbf84b937d4f04be53381926ed90a0~mv2.jpeg"
              alt="SCS UAE Uniforms"
              width={700}
              height={525}
              className="w-full object-cover"
            />
          </div>
          <div>
            <p className="text-primary text-xs font-bold tracking-widest uppercase mb-4">Our Story</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-5">
              Over a Decade of Uniform Excellence
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Founded in 2012, Smart Corporate Solutions started with a simple mission: provide businesses across the UAE
              with high-quality uniforms that reflect their brand identity.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Today we serve hundreds of clients across hospitality, healthcare, education, corporate, and industrial sectors —
              delivering tailored solutions that combine comfort, durability, and style.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              As a UAE registered company, we take pride in understanding the unique requirements of businesses operating
              in the Emirates and providing them with uniforms that meet the highest standards.
            </p>
            <Link href="/contact" className="btn-primary">Get in Touch</Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary text-xs font-bold tracking-widest uppercase mb-3">Why Choose Us</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <v.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="text-primary text-xs font-bold tracking-widest uppercase mb-3">The People Behind SCS</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Meet Our Team</h2>
        </div>

        {loadingTeam ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : team.length === 0 ? (
          <p className="text-center text-gray-400 py-12">Team information coming soon.</p>
        ) : (
          <div className={`grid gap-8 ${team.length === 1 ? 'max-w-sm mx-auto' : team.length === 2 ? 'sm:grid-cols-2 max-w-2xl mx-auto' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
            {team.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to Elevate Your Brand?
          </h2>
          <p className="text-white/70 mb-8">
            Contact us today for a free consultation and custom quote.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact#quote" className="bg-white text-primary font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors">
              Get a Free Quote
            </Link>
            <Link href="/products" className="border border-white/30 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors">
              Browse Products
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/10 to-primary/20 overflow-hidden">
        {member.photo_url ? (
          <Image
            src={member.photo_url}
            alt={member.name}
            fill
            className="object-cover object-top"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-4xl font-extrabold text-primary">{member.name.charAt(0)}</span>
            </div>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="w-10 h-1 bg-primary rounded-full mb-3" />
        <h3 className="text-xl font-extrabold text-gray-900">{member.name}</h3>
        <p className="text-primary font-semibold text-sm mb-3">{member.role}</p>
        {member.bio && (
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">{member.bio}</p>
        )}
        {(member.email || member.whatsapp || member.linkedin_url) && (
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
            {member.email && (
              <a href={`mailto:${member.email}`}
                className="p-2 rounded-lg bg-gray-50 hover:bg-primary hover:text-white text-gray-400 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            )}
            {member.whatsapp && (
              <a href={`https://wa.me/${member.whatsapp}`} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-50 hover:bg-[#25D366] hover:text-white text-gray-400 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            )}
            {member.linkedin_url && (
              <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-50 hover:bg-[#0A66C2] hover:text-white text-gray-400 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
