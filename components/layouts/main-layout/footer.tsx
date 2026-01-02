'use client';

import { Link } from '@/i18n/routing';
import { Watch } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations('Footer');

  return (
    <footer className="bg-muted/40 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Watch className="h-6 w-6" />
              <span className="text-xl font-bold">Watch Store</span>
            </Link>
            <p className="text-muted-foreground text-sm">{t('tagline')}</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {t('products')}
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {t('cart')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t('contact')}</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>Email: contact@watchstore.com</li>
              <li>Phone: +84 123 456 789</li>
              <li>Address: Ho Chi Minh City, Vietnam</li>
            </ul>
          </div>
        </div>

        <div className="text-muted-foreground mt-8 border-t pt-8 text-center text-sm">
          <p>{t('copyright', { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  );
}
