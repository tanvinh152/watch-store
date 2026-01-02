'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Order } from '@/types';
import { ORDER_STATUS_COLORS, PAYMENT_METHOD_LABELS } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';

interface OrderTableProps {
  orders: Order[];
}

export function OrderTable({ orders }: OrderTableProps) {
  const t = useTranslations('AdminOrders');

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: t('pending'),
      processing: t('processing'),
      delivered: t('delivered'),
      cancelled: t('cancelled'),
    };
    return statusMap[status] || status;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('orderId')}</TableHead>
            <TableHead>{t('customer')}</TableHead>
            <TableHead>{t('total')}</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>{t('status')}</TableHead>
            <TableHead>{t('date')}</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-muted-foreground py-8 text-center"
              >
                {t('noOrders')}
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">
                  {order.id.slice(0, 8)}...
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.customer_info.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {order.customer_info.phone}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {formatPrice(order.total_amount)}
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {PAYMENT_METHOD_LABELS[order.payment_method]}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge className={ORDER_STATUS_COLORS[order.status]}>
                    {getStatusLabel(order.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(order.created_at), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>
                  <Button asChild variant="ghost" size="icon">
                    <Link href={`/admin/orders/${order.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
