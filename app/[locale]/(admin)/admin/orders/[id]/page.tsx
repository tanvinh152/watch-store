import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { OrderDetail } from '@/components/admin/orders';
import { PageHeader } from '@/components/shared';
import { Order } from '@/types';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getOrder(id: string): Promise<Order | null> {
  const supabase = await createServerSupabaseClient();

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (orderError) {
    console.error('Error fetching order:', orderError);
    return null;
  }

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select(`
      *,
      product:products(*)
    `)
    .eq('order_id', id);

  if (itemsError) {
    console.error('Error fetching order items:', itemsError);
  }

  return {
    ...order,
    order_items: items || [],
  };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

  return (
    <div>
      <PageHeader title="Order Details">
        <Button asChild variant="outline" size="sm" className="gap-2">
          <Link href="/admin/orders">
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
      </PageHeader>

      <OrderDetail order={order} />
    </div>
  );
}

