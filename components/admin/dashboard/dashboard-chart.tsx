'use client';

import { useState, useMemo } from 'react';
import { subDays, subWeeks, subMonths, subYears, format } from 'date-fns';
import { useTranslations } from 'next-intl';

import { PeriodFilter, PeriodType } from './period-filter';
import { RevenueChart } from './revenue-chart';
import { DailyRevenue } from '@/types';

interface DashboardChartProps {
  initialData: DailyRevenue[];
}

export function DashboardChart({ initialData }: DashboardChartProps) {
  const t = useTranslations('AdminDashboard');
  const [period, setPeriod] = useState<PeriodType>('week');

  const chartData = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'day':
        startDate = subDays(now, 1);
        break;
      case 'week':
        startDate = subWeeks(now, 1);
        break;
      case 'month':
        startDate = subMonths(now, 1);
        break;
      case 'year':
        startDate = subYears(now, 1);
        break;
      default:
        startDate = subWeeks(now, 1);
    }

    const startDateStr = format(startDate, 'yyyy-MM-dd');

    return initialData.filter((item) => item.date >= startDateStr);
  }, [period, initialData]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <PeriodFilter
          value={period}
          onChange={setPeriod}
          translations={{
            day: t('day'),
            week: t('week'),
            month: t('month'),
            year: t('year'),
          }}
        />
      </div>
      <RevenueChart
        data={chartData}
        title={t('revenueChart')}
        revenueLabel={t('revenueLabel')}
      />
    </div>
  );
}
