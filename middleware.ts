import { NextResponse } from 'next/server';

export function middleware(req: any) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Allow public and API paths
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname === '/login' ||
    pathname.startsWith('/public') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get ? req.cookies.get('token') : null;
  const hasToken = token && (token.value || token);

  if (!hasToken) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'],
};
