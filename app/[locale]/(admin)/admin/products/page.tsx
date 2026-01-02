import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ProductTable } from '@/components/admin/products';
import { PageHeader } from '@/components/shared';
import { Product } from '@/types';

async function getProducts(): Promise<Product[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data || [];
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminProductsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [products, t] = await Promise.all([
    getProducts(),
    getTranslations('AdminProducts'),
  ]);

  return (
    <div>
      <PageHeader
        title={t('title')}
        description={t('description', { count: products.length })}
      >
        <Button asChild className="gap-2">
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4" />
            {t('addProduct')}
          </Link>
        </Button>
      </PageHeader>

      <ProductTable products={products} />
    </div>
  );
}
