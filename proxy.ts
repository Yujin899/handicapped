import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n/config';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const defaultLocale = i18n.defaultLocale;
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, assets, api) and standard static file extensions
    '/((?!api|_next/static|_next/image|favicon.ico|assets|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
