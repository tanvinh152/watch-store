'use client';

import { Link } from '@/i18n/routing';
import { ArrowRight, Watch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export function HeroSection() {
  const t = useTranslations('HomePage');

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-3xl">
          <div className="mb-4 flex items-center gap-2 text-amber-400">
            <Watch className="h-6 w-6" />
            <span className="text-sm font-semibold tracking-wider uppercase">
              {t('premiumTimepieces')}
            </span>
          </div>

          <h1 className="mb-6 text-4xl leading-tight font-bold md:text-6xl">
            {t('discoverTimeless')}
            <br />
            <span className="text-amber-400">{t('elegance')}</span>
          </h1>

          <p className="mb-8 max-w-xl text-lg text-slate-300 md:text-xl">
            {t('heroDescription')}
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-amber-500 font-semibold text-slate-900 hover:bg-amber-600"
            >
              <Link href="/products" className="gap-2">
                {t('shopNow')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 text-slate-900 hover:bg-white/10 hover:text-white"
            >
              <Link href="/products">{t('viewCollection')}</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/2 right-0 hidden h-full w-1/3 -translate-y-1/2 lg:block">
        <div className="absolute inset-0 bg-gradient-to-l from-amber-500/10 to-transparent" />
        <div className="absolute top-1/2 right-12 -translate-y-1/2">
          <div className="flex h-64 w-64 items-center justify-center rounded-full border-2 border-amber-400/30">
            <div className="flex h-48 w-48 items-center justify-center rounded-full border-2 border-amber-400/20">
              <Watch className="h-20 w-20 text-amber-400/40" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
