import { Product } from './product.types';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'cod' | 'bank_transfer';

export interface Address {
  street: string;
  ward: string;
  district: string;
  city: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  address: Address;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  quantity: number;
  price_at_purchase: number;
  created_at: string;
  product?: Product;
}

export interface Order {
  id: string;
  customer_info: CustomerInfo;
  total_amount: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface CreateOrderDto {
  customer_info: CustomerInfo;
  total_amount: number;
  payment_method: PaymentMethod;
  notes?: string | null;
}

export interface CreateOrderItemDto {
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
}

export interface OrderStats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
}

export interface DailyRevenue {
  date: string;
  revenue: number;
}

