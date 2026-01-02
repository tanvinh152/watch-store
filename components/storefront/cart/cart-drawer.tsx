'use client';

import { EmptyState } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useCart } from '@/hooks';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { CartItem } from './cart-item';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, total } = useCart();
  const t = useTranslations('CartDrawer');

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            {t('shoppingCart')} ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyState
              icon={ShoppingCart}
              title={t('emptyTitle')}
              description={t('emptyDescription')}
              actionLabel={t('browseProducts')}
              actionHref="/products"
            />
          </div>
        ) : (
          <>
            <ScrollArea className="min-h-0 flex-1">
              <div className="space-y-4 p-4 pr-6">
                {items.map((item) => (
                  <CartItem key={item.productId} item={item} />
                ))}
              </div>
            </ScrollArea>

            <Separator />

            <div className="space-y-4 p-4 pt-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>{t('total')}</span>
                <span>{formatPrice(total)}</span>
              </div>

              <SheetFooter className="flex-col gap-2 sm:flex-col">
                <Button asChild size="lg" className="w-full" onClick={onClose}>
                  <Link href="/checkout">{t('proceedToCheckout')}</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={onClose}
                  asChild
                >
                  <Link href="/cart">{t('viewCart')}</Link>
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
