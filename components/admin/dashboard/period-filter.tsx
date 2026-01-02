'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type PeriodType = 'day' | 'week' | 'month' | 'year';

interface PeriodFilterProps {
  value: PeriodType;
  onChange: (period: PeriodType) => void;
  translations: {
    day: string;
    week: string;
    month: string;
    year: string;
  };
}

export function PeriodFilter({
  value,
  onChange,
  translations,
}: PeriodFilterProps) {
  const periods: { key: PeriodType; label: string }[] = [
    { key: 'day', label: translations.day },
    { key: 'week', label: translations.week },
    { key: 'month', label: translations.month },
    { key: 'year', label: translations.year },
  ];

  return (
    <div className="bg-muted flex gap-1 rounded-lg p-1">
      {periods.map((period) => (
        <Button
          key={period.key}
          variant="ghost"
          size="sm"
          className={cn(
            'h-auto px-3 py-1.5 text-sm font-medium transition-all',
            value === period.key
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-transparent'
          )}
          onClick={() => onChange(period.key)}
        >
          {period.label}
        </Button>
      ))}
    </div>
  );
}
