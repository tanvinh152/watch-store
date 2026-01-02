import { ProductForm } from '@/components/admin/products';
import { PageHeader } from '@/components/shared';
import { getTranslations } from 'next-intl/server';

export default async function NewProductPage() {
  const t = await getTranslations('AdminProducts');

  return (
    <div>
      <PageHeader
        title={t('addNewProduct')}
        description={t('createNewProduct')}
      />
      <ProductForm />
    </div>
  );
}
