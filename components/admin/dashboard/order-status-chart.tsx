'use client';

import { Doughnut } from 'react-chartjs-2';
import { TooltipItem, ChartOptions } from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import './chart-provider'; // Register Chart.js

interface OrderStatusChartProps {
  data: {
    pending: number;
    processing: number;
    delivered: number;
    cancelled: number;
  };
  translations: {
    title: string;
    pending: string;
    processing: string;
    delivered: string;
    cancelled: string;
    totalLabel: string;
  };
}

export function OrderStatusChart({
  data,
  translations,
}: OrderStatusChartProps) {
  const total =
    data.pending + data.processing + data.delivered + data.cancelled;

  const chartData = {
    labels: [
      translations.pending,
      translations.processing,
      translations.delivered,
      translations.cancelled,
    ],
    datasets: [
      {
        data: [data.pending, data.processing, data.delivered, data.cancelled],
        backgroundColor: [
          'rgba(251, 191, 36, 0.9)', // Pending - Amber
          'rgba(59, 130, 246, 0.9)', // Processing - Blue
          'rgba(34, 197, 94, 0.9)', // Delivered - Green
          'rgba(239, 68, 68, 0.9)', // Cancelled - Red
        ],
        borderColor: [
          'rgb(251, 191, 36)',
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          color: 'hsl(var(--foreground))',
        },
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'doughnut'>) => {
            const value = context.parsed ?? 0;
            const percentage =
              total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{translations.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[250px]">
          <Doughnut data={chartData} options={options} />
          {/* Center text showing total */}
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            style={{ marginBottom: '40px' }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold">{total}</div>
              <div className="text-muted-foreground text-sm">
                {translations.totalLabel}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
