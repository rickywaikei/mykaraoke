import createMiddleware from 'next-intl/middleware';
import { locales } from './app/i18n';

export default createMiddleware({
  // A list of all locales that are supported
  locales: locales,
  
  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale: 'en',
  
  // Detect locale from browser/cookie settings
  localeDetection: true,
  
  // Redirect to locale path if not matched
  localePrefix: 'always'
});

export const config = {
  // Match all pathnames except for
  // - files with extensions (e.g. favicon.ico)
  // - API routes
  // - _next paths (Next.js internals)
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
