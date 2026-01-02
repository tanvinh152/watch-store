import { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { OrderTable, OrderFilter } from '@/components/admin/orders';
import { PageHeader, PageLoader } from '@/components/shared';
import { Order } from '@/types';

interface OrdersPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string }>;
}

async function getOrders(status?: string): Promise<Order[]> {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return data || [];
}

export default async function AdminOrdersPage({
  params,
  searchParams,
}: OrdersPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { status } = await searchParams;
  const [orders, t] = await Promise.all([
    getOrders(status),
    getTranslations('AdminOrders'),
  ]);

  return (
    <div>
      <PageHeader
        title={t('title')}
        description={t('description', { count: orders.length })}
      />

      <div className="space-y-4">
        <Suspense fallback={null}>
          <OrderFilter />
        </Suspense>

        <Suspense fallback={<PageLoader />}>
          <OrderTable orders={orders} />
        </Suspense>
      </div>
    </div>
  );
}
