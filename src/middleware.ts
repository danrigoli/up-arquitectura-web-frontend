import { NextRequest, NextResponse } from 'next/server'
import { auth } from './auth'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const session = await auth()

  const authViews = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ];

  if (!session && !authViews.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (session && authViews.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}
 

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}