'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks';
import { formatPrice } from '@/lib/utils';
import { Watch } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export function OrderSummary() {
  const { items, total } = useCart();
  const t = useTranslations('Checkout');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('orderSummary')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-3">
              <div className="bg-muted relative h-16 w-16 shrink-0 overflow-hidden rounded-md">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Watch className="text-muted-foreground h-6 w-6" />
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col">
                <p className="text-muted-foreground text-xs">{item.brand}</p>
                <p className="line-clamp-1 text-sm font-medium">{item.name}</p>
                <p className="text-muted-foreground text-sm">
                  {t('qty')}: {item.quantity} × {formatPrice(item.price)}
                </p>
              </div>
              <div className="text-sm font-medium">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('subtotal')}</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('shipping')}</span>
            <span className="text-green-600">{t('free')}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-semibold">
          <span>{t('total')}</span>
          <span>{formatPrice(total)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
