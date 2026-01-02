'use client';

import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/storefront/products/product-card';
import { Product } from '@/types';
import { useTranslations } from 'next-intl';

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const t = useTranslations('HomePage');

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="mb-2 text-3xl font-bold">{t('featuredWatches')}</h2>
            <p className="text-muted-foreground">{t('featuredDescription')}</p>
          </div>
          <Button asChild variant="outline" className="self-start md:self-auto">
            <Link href="/products" className="gap-2">
              {t('viewAllProducts')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
