import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ProductForm } from '@/components/admin/products';
import { PageHeader } from '@/components/shared';
import { Product } from '@/types';
import { getTranslations } from 'next-intl/server';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string): Promise<Product | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);
  const t = await getTranslations('AdminProducts');

  if (!product) {
    notFound();
  }

  return (
    <div>
      <PageHeader title={t('editProduct')} description={`${product.name}`} />
      <ProductForm product={product} />
    </div>
  );
}
