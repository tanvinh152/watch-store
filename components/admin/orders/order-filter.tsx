'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function OrderFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get('status') || 'all';
  const t = useTranslations('AdminOrders');

  const statusOptions = [
    { value: 'all', label: t('all') },
    { value: 'pending', label: t('pending') },
    { value: 'processing', label: t('processing') },
    { value: 'delivered', label: t('delivered') },
    { value: 'cancelled', label: t('cancelled') },
  ];

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === 'all') {
      params.delete('status');
    } else {
      params.set('status', status);
    }
    router.push(`/admin/orders?${params.toString()}`);
  };

  return (
    <Tabs value={currentStatus} onValueChange={handleStatusChange}>
      <TabsList className="h-auto flex-wrap gap-1">
        {statusOptions.map((option) => (
          <TabsTrigger
            key={option.value}
            value={option.value}
            className="text-xs"
          >
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
