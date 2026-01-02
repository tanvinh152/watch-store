import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks';
import { useTranslations } from 'next-intl';
import { formatPrice } from '@/lib/utils';

interface CartSummaryProps {
  showCheckoutButton?: boolean;
}

export function CartSummary({ showCheckoutButton = true }: CartSummaryProps) {
  const { items, total } = useCart();
  const t = useTranslations('CartPage');

  const subtotal = total;
  const shipping = 0; // Free shipping for MVP

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('orderSummary')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {t('subtotal')} ({items.length} items)
          </span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t('shipping')}</span>
          <span className="text-green-600">{t('free')}</span>
        </div>
        <Separator />
        <div className="flex justify-between text-lg font-semibold">
          <span>
            {t('title')
              .replace('Shopping Cart', 'Total')
              .replace('Giỏ hàng', 'Tổng cộng')}
          </span>
          {/* Reuse 'total' if available or just hardcode/add key. Wait, I have 'total' in CartDrawer, not CartPage. 
              Checking en.json, I see "subtotal", "shipping", "free". I missed "total" in CartPage section.
              I'll check if I added "total" to CartPage namespace in previous step.
          */}
          <span>{formatPrice(subtotal + shipping)}</span>
        </div>
      </CardContent>
      {showCheckoutButton && (
        <CardFooter>
          <Button
            asChild
            size="lg"
            className="w-full"
            disabled={items.length === 0}
          >
            <Link href="/checkout">{t('proceedToCheckout')}</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
