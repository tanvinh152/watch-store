import { DollarSign, ShoppingCart, Clock } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import {
  KPICard,
  DashboardChart,
  RecentOrders,
  OrdersOverviewChart,
  OrderStatusChart,
} from '@/components/admin/dashboard';
import { PageHeader } from '@/components/shared';
import { Order, OrderStats, DailyRevenue } from '@/types';
import { format, subDays } from 'date-fns';
import { RECENT_ORDERS_LIMIT } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';

// Extended range to support date filtering (1 year)
const EXTENDED_CHART_DAYS = 365;

interface OrdersByStatus {
  pending: number;
  processing: number;
  delivered: number;
  cancelled: number;
}

async function getStats(): Promise<OrderStats> {
  const supabase = await createServerSupabaseClient();

  const { data: orders, error } = await supabase
    .from('orders')
    .select('total_amount, status');

  if (error) {
    console.error('Error fetching stats:', error);
    return { totalRevenue: 0, totalOrders: 0, pendingOrders: 0 };
  }

  const allOrders = orders || [];

  const totalRevenue = allOrders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + Number(o.total_amount), 0);

  const totalOrders = allOrders.length;
  const pendingOrders = allOrders.filter((o) => o.status === 'pending').length;

  return { totalRevenue, totalOrders, pendingOrders };
}

async function getOrdersByStatus(): Promise<OrdersByStatus> {
  const supabase = await createServerSupabaseClient();

  const { data: orders, error } = await supabase
    .from('orders')
    .select('status');

  if (error) {
    console.error('Error fetching orders by status:', error);
    return { pending: 0, processing: 0, delivered: 0, cancelled: 0 };
  }

  const allOrders = orders || [];

  return {
    pending: allOrders.filter((o) => o.status === 'pending').length,
    processing: allOrders.filter((o) => o.status === 'processing').length,
    delivered: allOrders.filter((o) => o.status === 'delivered').length,
    cancelled: allOrders.filter((o) => o.status === 'cancelled').length,
  };
}

async function getDailyRevenue(): Promise<DailyRevenue[]> {
  const supabase = await createServerSupabaseClient();
  const startDate = subDays(new Date(), EXTENDED_CHART_DAYS - 1);

  const { data, error } = await supabase
    .from('orders')
    .select('total_amount, created_at, status')
    .eq('status', 'delivered')
    .gte('created_at', startDate.toISOString());

  if (error) {
    console.error('Error fetching daily revenue:', error);
    return [];
  }

  const revenueByDate: Record<string, number> = {};

  // Initialize all days with 0
  for (let i = 0; i < EXTENDED_CHART_DAYS; i++) {
    const date = format(
      subDays(new Date(), EXTENDED_CHART_DAYS - 1 - i),
      'yyyy-MM-dd'
    );
    revenueByDate[date] = 0;
  }

  // Sum up revenue by date
  (data || []).forEach((order) => {
    const date = format(new Date(order.created_at), 'yyyy-MM-dd');
    if (revenueByDate[date] !== undefined) {
      revenueByDate[date] += Number(order.total_amount);
    }
  });

  return Object.entries(revenueByDate).map(([date, revenue]) => ({
    date,
    revenue,
  }));
}

async function getRecentOrders(): Promise<Order[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(RECENT_ORDERS_LIMIT);

  if (error) {
    console.error('Error fetching recent orders:', error);
    return [];
  }

  return data || [];
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminDashboardPage({ params }: PageProps) {
  const { locale } = await params;

  // Enable static rendering with correct locale
  setRequestLocale(locale);

  const [stats, ordersByStatus, dailyRevenue, recentOrders, t] =
    await Promise.all([
      getStats(),
      getOrdersByStatus(),
      getDailyRevenue(),
      getRecentOrders(),
      getTranslations('AdminDashboard'),
    ]);

  return (
    <div className="space-y-6">
      <PageHeader title={t('title')} description={t('description')} />

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <KPICard
          title={t('totalRevenue')}
          value={formatPrice(stats.totalRevenue)}
          icon={DollarSign}
          description={t('totalRevenueDesc')}
        />
        <KPICard
          title={t('totalOrders')}
          value={stats.totalOrders}
          icon={ShoppingCart}
          description={t('totalOrdersDesc')}
        />
        <KPICard
          title={t('pendingOrders')}
          value={stats.pendingOrders}
          icon={Clock}
          description={t('pendingOrdersDesc')}
        />
      </div>

      {/* Revenue Chart - Full Width */}
      <DashboardChart initialData={dailyRevenue} />

      {/* Order Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <OrdersOverviewChart
          data={ordersByStatus}
          translations={{
            title: t('ordersOverview'),
            pending: t('pending'),
            processing: t('processing'),
            delivered: t('delivered'),
            cancelled: t('cancelled'),
          }}
        />
        <OrderStatusChart
          data={ordersByStatus}
          translations={{
            title: t('orderStatus'),
            pending: t('pending'),
            processing: t('processing'),
            delivered: t('delivered'),
            cancelled: t('cancelled'),
            totalLabel: t('totalLabel'),
          }}
        />
      </div>

      {/* Recent Orders */}
      <RecentOrders
        orders={recentOrders}
        translations={{
          title: t('recentOrders'),
          viewAll: t('viewAll'),
          orderId: t('orderId'),
          customer: t('customer'),
          total: t('total'),
          status: t('status'),
          date: t('date'),
          noOrders: t('noOrders'),
        }}
      />
    </div>
  );
}
