'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useCart } from '@/hooks';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const t = useTranslations('ProductCard');

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(t('addedToCart', { name: product.name }));
  };

  const displayPrice = product.sale_price ?? product.price;
  const hasDiscount = product.sale_price !== null;

  return (
    <Card className="group border-muted/40 flex h-full flex-col overflow-hidden rounded-xl transition-all hover:shadow-lg">
      <Link href={`/products/${product.id}`} className="flex flex-1 flex-col">
        <div className="bg-secondary relative aspect-square shrink-0 overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-muted-foreground">{t('noImage')}</span>
            </div>
          )}
          {hasDiscount && (
            <Badge
              variant="destructive"
              className="absolute top-3 left-3 rounded-full"
            >
              {t('sale')}
            </Badge>
          )}
          {!product.stock_status && (
            <Badge
              variant="secondary"
              className="absolute top-3 right-3 rounded-full"
            >
              {t('outOfStock')}
            </Badge>
          )}
        </div>

        <CardContent className="flex flex-1 flex-col p-5">
          <p className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
            {product.brand}
          </p>
          <h3 className="mt-2 line-clamp-2 leading-relaxed font-semibold">
            {product.name}
          </h3>
          <div className="mt-auto flex items-center gap-2 pt-3">
            <span className="text-primary text-lg font-bold">
              {formatPrice(displayPrice)}
            </span>
            {hasDiscount && (
              <span className="text-muted-foreground text-sm line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </CardContent>
      </Link>

      <CardFooter className="p-5 pt-0">
        <Button
          className="w-full gap-2 rounded-full shadow-sm transition-transform hover:-translate-y-0.5"
          onClick={handleAddToCart}
          disabled={!product.stock_status}
        >
          <ShoppingCart className="h-4 w-4" />
          {t('addToCart')}
        </Button>
      </CardFooter>
    </Card>
  );
}
