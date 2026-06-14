import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isAdminPath = req.nextUrl.pathname.startsWith('/admin')
  const isLoginPath = req.nextUrl.pathname === '/admin/login'

  // Redirect unauthenticated users away from admin (except login page)
  if (isAdminPath && !isLoginPath && !session) {
    const loginUrl = new URL('/admin/login', req.url)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users away from login page
  if (isLoginPath && session) {
    const dashUrl = new URL('/admin/dashboard', req.url)
    return NextResponse.redirect(dashUrl)
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*'],
}
