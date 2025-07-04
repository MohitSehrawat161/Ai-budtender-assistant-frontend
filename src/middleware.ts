import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === '/login' || path === '/sign-up';

  // Get the token from the cookies
  const token = request.cookies.get('token')?.value || '';

  // Redirect to login if trying to access a protected path without a token
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  // Redirect to home if trying to access a public path with a token
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/login',
    '/sign-up',
    '/strains',
    '/products',
    '/settings',
  ],
}; 