import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'vi'],

  // Used when no locale matches
  defaultLocale: 'vi',

  // Hide the default locale prefix in the URL
  localePrefix: 'as-needed',
});

// Lightweight wrappers around Next.js' navigation APIs
// that will assist with routing strategy.
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
