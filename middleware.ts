import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session token from cookies
  const sessionToken = request.cookies.get('authjs.session-token')?.value ||
                       request.cookies.get('__Secure-authjs.session-token')?.value;

  const isAuthenticated = !!sessionToken;

  // Protected routes that require authentication
  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api/admin');

  // Check if user is trying to access protected route without authentication
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check if authenticated user is trying to access login page
  if (pathname === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // For API routes, check authentication
  if (pathname.startsWith('/api/admin')) {
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
