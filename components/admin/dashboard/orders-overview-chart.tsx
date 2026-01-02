'use client';

import { Bar } from 'react-chartjs-2';
import { TooltipItem } from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import './chart-provider'; // Register Chart.js

interface OrdersOverviewChartProps {
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
  };
}

export function OrdersOverviewChart({
  data,
  translations,
}: OrdersOverviewChartProps) {
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
          'rgba(251, 191, 36, 0.8)', // Pending - Amber
          'rgba(59, 130, 246, 0.8)', // Processing - Blue
          'rgba(34, 197, 94, 0.8)', // Delivered - Green
          'rgba(239, 68, 68, 0.8)', // Cancelled - Red
        ],
        borderColor: [
          'rgb(251, 191, 36)',
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
        borderRadius: 8,
        barThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'bar'>) => {
            const value = context.parsed.y ?? 0;
            return `${value} orders`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'hsl(var(--border))',
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          stepSize: 1,
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
        <div className="h-[250px]">
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
