import { type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { updateSession } from '@/lib/supabase/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // 1. Run Supabase auth middleware first to update session
  const response = await updateSession(request);

  // 2. Run next-intl middleware for locale handling
  // Note: We need to respect the response from Supabase (e.g. cookies)
  // but next-intl also needs to handle the response for redirects/rewrites.
  // A common pattern is to let next-intl handle the response creation if Supabase didn't redirect.

  // If Supabase redirected, we should probably return that response.
  if (response.status >= 300 && response.status < 400) {
    return response;
  }

  // Otherwise, run intl middleware
  const intlResponse = intlMiddleware(request);

  // Merge headers/cookies from Supabase response to intlResponse
  response.headers.forEach((value, key) => {
    intlResponse.headers.set(key, value);
  });

  // Assuming Supabase middleware primarily sets cookies on the request/response
  // we ensure those are propagated.
  // (Note: updateSession in supabase/ssr usually sets cookies on the Request/Response)

  return intlResponse;
}

export const config = {
  matcher: [
    '/',
    '/(vi|en)/:path*',
    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    '/((?!_next|_vercel|.*\\..*).*)',
  ],
};
