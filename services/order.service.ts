import { createClient } from '@/lib/supabase/client';
import {
  Order,
  OrderItem,
  CreateOrderDto,
  CreateOrderItemDto,
  OrderStats,
  DailyRevenue,
  OrderStatus,
} from '@/types';
import { format, subDays } from 'date-fns';

const supabase = createClient();

export const orderService = {
  async getAll(statusFilter?: string): Promise<Order[]> {
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Order | null> {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (orderError) {
      if (orderError.code === 'PGRST116') return null;
      throw orderError;
    }

    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select(
        `
        *,
        product:products(*)
      `
      )
      .eq('order_id', id);

    if (itemsError) throw itemsError;

    return {
      ...order,
      order_items: items || [],
    };
  },

  async getRecent(limit: number = 5): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  async getStats(): Promise<OrderStats> {
    const { data: allOrders, error: allError } = await supabase
      .from('orders')
      .select('total_amount, status');

    if (allError) throw allError;

    const orders = allOrders || [];

    const totalRevenue = orders
      .filter((o) => o.status === 'delivered')
      .reduce((sum, o) => sum + Number(o.total_amount), 0);

    const totalOrders = orders.length;

    const pendingOrders = orders.filter((o) => o.status === 'pending').length;

    return {
      totalRevenue,
      totalOrders,
      pendingOrders,
    };
  },

  async getDailyRevenue(days: number = 7): Promise<DailyRevenue[]> {
    const startDate = subDays(new Date(), days - 1);

    const { data, error } = await supabase
      .from('orders')
      .select('total_amount, created_at, status')
      .eq('status', 'delivered')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    const revenueByDate: Record<string, number> = {};

    // Initialize all days with 0
    for (let i = 0; i < days; i++) {
      const date = format(subDays(new Date(), days - 1 - i), 'yyyy-MM-dd');
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
  },

  async create(dto: CreateOrderDto): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .insert(dto)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async createOrderItems(items: CreateOrderItemDto[]): Promise<OrderItem[]> {
    const { data, error } = await supabase
      .from('order_items')
      .insert(items)
      .select();

    if (error) throw error;
    return data || [];
  },

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

