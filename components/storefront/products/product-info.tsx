'use client';

import { useState } from 'react';
import {
  ShoppingCart,
  Minus,
  Plus,
  Check,
  Shield,
  Truck,
  RotateCcw,
  Award,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Product } from '@/types';
import { useCart } from '@/hooks';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils';

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const displayPrice = product.sale_price ?? product.price;
  const hasDiscount = product.sale_price !== null;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - (product.sale_price || 0)) / product.price) * 100
      )
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} x ${product.name} added to cart`);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="space-y-6">
      {/* Brand Badge */}
      <div className="flex items-center gap-3">
        <Badge
          variant="outline"
          className="px-3 py-1 text-xs font-semibold tracking-widest uppercase"
        >
          {product.brand}
        </Badge>
        {product.stock_status ? (
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-700 hover:bg-green-100"
          >
            <Check className="mr-1 h-3 w-3" />
            In Stock
          </Badge>
        ) : (
          <Badge
            variant="secondary"
            className="bg-red-100 text-red-700 hover:bg-red-100"
          >
            Out of Stock
          </Badge>
        )}
      </div>

      {/* Product Name */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {product.name}
        </h1>
        <p className="text-muted-foreground mt-2">
          Reference: {product.slug.toUpperCase()}
        </p>
      </div>

      {/* Price Section */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-4xl font-bold">
            {formatPrice(displayPrice)}
          </span>
          {hasDiscount && (
            <>
              <span className="text-muted-foreground text-xl line-through">
                {formatPrice(product.price)}
              </span>
              <Badge variant="destructive" className="text-sm font-semibold">
                Save {discountPercent}%
              </Badge>
            </>
          )}
        </div>
        {hasDiscount && (
          <p className="mt-2 text-sm font-medium text-green-600">
            You save {formatPrice(product.price - (product.sale_price || 0))}
          </p>
        )}
      </div>

      {/* Description */}
      {product.description && (
        <div>
          <h3 className="mb-3 text-lg font-semibold">About This Watch</h3>
          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>
        </div>
      )}

      <Separator />

      {/* Quick Specs Preview */}
      {product.specs_json && (
        <div className="grid grid-cols-2 gap-4">
          {product.specs_json.caseDiameter && (
            <div className="bg-muted/30 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold">
                {product.specs_json.caseDiameter}
              </p>
              <p className="text-muted-foreground text-xs tracking-wide uppercase">
                Case Size
              </p>
            </div>
          )}
          {product.specs_json.movement && (
            <div className="bg-muted/30 rounded-lg p-3 text-center">
              <p className="text-sm font-bold">{product.specs_json.movement}</p>
              <p className="text-muted-foreground text-xs tracking-wide uppercase">
                Movement
              </p>
            </div>
          )}
          {product.specs_json.waterResistance && (
            <div className="bg-muted/30 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold">
                {product.specs_json.waterResistance}
              </p>
              <p className="text-muted-foreground text-xs tracking-wide uppercase">
                Water Resist
              </p>
            </div>
          )}
          {product.specs_json.caseMaterial && (
            <div className="bg-muted/30 rounded-lg p-3 text-center">
              <p className="text-sm font-bold">
                {product.specs_json.caseMaterial}
              </p>
              <p className="text-muted-foreground text-xs tracking-wide uppercase">
                Material
              </p>
            </div>
          )}
        </div>
      )}

      <Separator />

      {/* Quantity & Add to Cart */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Quantity:</span>
          <div className="flex items-center overflow-hidden rounded-lg border">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-none"
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-14 text-center text-lg font-semibold">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-none"
              onClick={increaseQuantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            size="lg"
            className="h-14 flex-1 gap-3 text-lg font-semibold"
            onClick={handleAddToCart}
            disabled={!product.stock_status}
          >
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-14 w-14"
            title="Add to Wishlist"
          >
            <Heart className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-3 pt-4">
        <div className="flex items-center gap-3 rounded-lg border p-3">
          <div className="bg-primary/10 rounded-full p-2">
            <Shield className="text-primary h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">Authentic</p>
            <p className="text-muted-foreground text-xs">100% Genuine</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border p-3">
          <div className="bg-primary/10 rounded-full p-2">
            <Truck className="text-primary h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">Free Shipping</p>
            <p className="text-muted-foreground text-xs">Insured Delivery</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border p-3">
          <div className="bg-primary/10 rounded-full p-2">
            <RotateCcw className="text-primary h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">Easy Returns</p>
            <p className="text-muted-foreground text-xs">30-Day Policy</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border p-3">
          <div className="bg-primary/10 rounded-full p-2">
            <Award className="text-primary h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">Warranty</p>
            <p className="text-muted-foreground text-xs">
              {product.specs_json?.warranty || '2 Years'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
