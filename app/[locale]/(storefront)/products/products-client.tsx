'use client';

import { useMemo } from 'react';
import { ProductGrid } from '@/components/storefront/products';
import { Product } from '@/types';
import { useFilters } from '@/hooks';

interface ProductGridClientProps {
  products: Product[];
}

export function ProductGridClient({ products }: ProductGridClientProps) {
  const { selectedBrands, priceRange } = useFilters();

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }

      // Price filter
      const price = product.sale_price ?? product.price;
      if (priceRange.min > 0 && price < priceRange.min) {
        return false;
      }
      if (priceRange.max !== null && price > priceRange.max) {
        return false;
      }

      return true;
    });
  }, [products, selectedBrands, priceRange]);

  return <ProductGrid products={filteredProducts} />;
}

