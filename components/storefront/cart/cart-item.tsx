'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2, Watch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem as CartItemType } from '@/types';
import { useCart } from '@/hooks';
import { formatPrice } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
  showRemove?: boolean;
}

export function CartItem({ item, showRemove = true }: CartItemProps) {
  const { updateItemQuantity, removeFromCart } = useCart();

  const handleDecrease = () => {
    updateItemQuantity(item.productId, item.quantity - 1);
  };

  const handleIncrease = () => {
    updateItemQuantity(item.productId, item.quantity + 1);
  };

  const handleRemove = () => {
    removeFromCart(item.productId);
  };

  return (
    <div className="flex gap-4">
      {/* Image */}
      <div className="bg-muted relative h-20 w-20 shrink-0 overflow-hidden rounded-md">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Watch className="text-muted-foreground h-8 w-8" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <p className="text-muted-foreground text-xs">{item.brand}</p>
            <h4 className="line-clamp-1 font-medium">{item.name}</h4>
          </div>
          {showRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive h-8 w-8"
              onClick={handleRemove}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center rounded-md border">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleDecrease}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleIncrease}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Price */}
          <span className="font-semibold">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
