import { Suspense } from 'react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { FilterPanel } from '@/components/storefront/products';
import { PageHeader, PageLoader } from '@/components/shared';
import { Product } from '@/types';
import { ProductGridClient } from './products-client';
import { getTranslations } from 'next-intl/server';

async function getProducts(): Promise<Product[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('stock_status', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data || [];
}

export default async function ProductsPage() {
  const products = await getProducts();
  const t = await getTranslations('ProductsPage');

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title={t('title')}
        description={t('showingProducts', { count: products.length })}
      />
      <Suspense fallback={<PageLoader />}>
        <div className="flex flex-col gap-8 lg:flex-row">
          <FilterPanel />
          <div className="flex-1">
            <ProductGridClient products={products} />
          </div>
        </div>
      </Suspense>
    </div>
  );
}
