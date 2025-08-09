import { NextResponse } from 'next/server';

export function middleware(req) {
  const token = req.cookies.get('token');

  const protectedPaths = ['/', '/dashboard'];
  const { pathname } = req.nextUrl;

  if (protectedPaths.some(path => pathname === path || pathname.startsWith(path + '/'))) {
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*'],
};
