'use client';

import Link from 'next/link';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CheckoutForm, OrderSummary } from '@/components/storefront/checkout';
import { PageHeader, EmptyState } from '@/components/shared';
import { useCart } from '@/hooks';
import { useTranslations } from 'next-intl';

export default function CheckoutPage() {
  const { items } = useCart();
  const t = useTranslations('Checkout');

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PageHeader title={t('title')} />
        <EmptyState
          icon={ShoppingCart}
          title={t('emptyTitle')}
          description={t('emptyDescription')}
          actionLabel={t('browseProducts')}
          actionHref="/products"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title={t('title')}>
        <Button asChild variant="outline" size="sm" className="gap-2">
          <Link href="/cart">
            <ArrowLeft className="h-4 w-4" />
            {t('backToCart')}
          </Link>
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <CheckoutForm />
        </div>

        {/* Order Summary */}
        <div>
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
