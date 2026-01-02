'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OrderStatus } from '@/types';
import { ORDER_STATUS_LABELS } from '@/lib/constants';
import { orderService } from '@/services';
import { toast } from 'sonner';

interface StatusDropdownProps {
  orderId: string;
  currentStatus: OrderStatus;
}

const statusOptions: OrderStatus[] = [
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
];

export function StatusDropdown({ orderId, currentStatus }: StatusDropdownProps) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (newStatus === status) return;

    setIsUpdating(true);
    try {
      await orderService.updateStatus(orderId, newStatus);
      setStatus(newStatus);
      toast.success(`Order status updated to ${ORDER_STATUS_LABELS[newStatus]}`);
      router.refresh();
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Select
      value={status}
      onValueChange={(value) => handleStatusChange(value as OrderStatus)}
      disabled={isUpdating}
    >
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option} value={option}>
            {ORDER_STATUS_LABELS[option]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

