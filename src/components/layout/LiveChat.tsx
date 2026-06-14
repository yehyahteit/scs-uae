'use client'

import { useEffect } from 'react'

interface Props {
  provider: 'tawk' | 'crisp' | 'none'
  tawkPropertyId?: string
  crispWebsiteId?: string
}

export default function LiveChat({ provider, tawkPropertyId, crispWebsiteId }: Props) {
  useEffect(() => {
    if (provider === 'tawk' && tawkPropertyId) {
      const s = document.createElement('script')
      s.async = true
      s.src = `https://embed.tawk.to/${tawkPropertyId}/default`
      s.charset = 'UTF-8'
      s.setAttribute('crossorigin', '*')
      document.head.appendChild(s)
    }

    if (provider === 'crisp' && crispWebsiteId) {
      ;(window as any).$crisp = []
      ;(window as any).CRISP_WEBSITE_ID = crispWebsiteId
      const d = document
      const s = d.createElement('script')
      s.src = 'https://client.crisp.chat/l.js'
      s.async = true
      d.getElementsByTagName('head')[0].appendChild(s)
    }
  }, [provider, tawkPropertyId, crispWebsiteId])

  return null
}
