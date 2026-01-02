import { createServerSupabaseClient } from '@/lib/supabase/server';
import { HeroSection, FeaturedProducts } from '@/components/storefront/home';
import { FEATURED_PRODUCTS_LIMIT } from '@/lib/constants';
import { Product } from '@/types';

async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('stock_status', true)
    .order('created_at', { ascending: false })
    .limit(FEATURED_PRODUCTS_LIMIT);

  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }

  return data || [];
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      <HeroSection />
      <FeaturedProducts products={featuredProducts} />
    </>
  );
}

