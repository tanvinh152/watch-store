'use client';

import Link from 'next/link';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CartItem, CartSummary } from '@/components/storefront/cart';
import { PageHeader, EmptyState } from '@/components/shared';
import { useCart } from '@/hooks';
import { useTranslations } from 'next-intl';

export default function CartPage() {
  const { items } = useCart();
  const t = useTranslations('CartPage');

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title={t('title')} />

      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title={t('emptyTitle')}
          description={t('emptyDescription')}
          actionLabel={t('startShopping')}
          actionHref="/products"
        />
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <ScrollArea className="h-[calc(100vh-280px)] min-h-[400px] pr-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.productId}>
                    <CartItem item={item} />
                    <Separator className="mt-4" />
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="mt-6">
              <Button asChild variant="outline" className="gap-2">
                <Link href="/products">
                  <ArrowLeft className="h-4 w-4" />
                  {t('continueShopping')}
                </Link>
              </Button>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="sticky top-20 h-fit">
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
}
