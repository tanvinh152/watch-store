'use client';

import Image from 'next/image';
import { format } from 'date-fns';
import { Watch } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Order } from '@/types';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS } from '@/lib/constants';
import { StatusDropdown } from './status-dropdown';

interface OrderDetailProps {
  order: Order;
}

export function OrderDetail({ order }: OrderDetailProps) {
  return (
    <div className="space-y-6">
      {/* Order Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Order Details</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Order ID: {order.id}
            </p>
          </div>
          <Badge className={ORDER_STATUS_COLORS[order.status]} >
            {ORDER_STATUS_LABELS[order.status]}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Date</p>
              <p className="font-medium">
                {format(new Date(order.created_at), 'MMM dd, yyyy HH:mm')}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Amount</p>
              <p className="font-medium">${order.total_amount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Payment Method</p>
              <p className="font-medium">
                {PAYMENT_METHOD_LABELS[order.payment_method]}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Update Status</p>
              <StatusDropdown orderId={order.id} currentStatus={order.status} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{order.customer_info.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{order.customer_info.phone}</p>
            </div>
            {order.customer_info.email && (
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{order.customer_info.email}</p>
              </div>
            )}
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Shipping Address</p>
              <p className="font-medium">
                {order.customer_info.address.street}
                <br />
                {order.customer_info.address.ward},{' '}
                {order.customer_info.address.district}
                <br />
                {order.customer_info.address.city}
              </p>
            </div>
            {order.notes && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Order Notes</p>
                  <p className="font-medium">{order.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-muted">
                    {item.product?.image_url ? (
                      <Image
                        src={item.product.image_url}
                        alt={item.product?.name || 'Product'}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Watch className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium line-clamp-1">
                      {item.product?.name || 'Product deleted'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity} × ${item.price_at_purchase.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right font-medium">
                    ${(item.quantity * item.price_at_purchase).toFixed(2)}
                  </div>
                </div>
              ))}

              <Separator />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

