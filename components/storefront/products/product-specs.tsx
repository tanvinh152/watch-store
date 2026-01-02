'use client';

import { useState } from 'react';
import {
  Watch,
  Gauge,
  Settings,
  Droplets,
  Gem,
  Ribbon,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ProductSpecs as ProductSpecsType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface ProductSpecsProps {
  specs: ProductSpecsType | null;
  description?: string | null;
}

interface SpecItem {
  key: keyof ProductSpecsType;
  icon: React.ElementType;
}

const specConfig: SpecItem[] = [
  {
    key: 'caseMaterial',
    icon: Watch,
  },
  {
    key: 'caseDiameter',
    icon: Gauge,
  },
  {
    key: 'movement',
    icon: Settings,
  },
  {
    key: 'waterResistance',
    icon: Droplets,
  },
  {
    key: 'crystal',
    icon: Gem,
  },
  {
    key: 'strapMaterial',
    icon: Ribbon,
  },
  {
    key: 'warranty',
    icon: Award,
  },
];

export function ProductSpecs({ specs, description }: ProductSpecsProps) {
  const t = useTranslations('ProductSpecs');
  const [isExpanded, setIsExpanded] = useState(false);

  if (!specs) return null;

  const availableSpecs = specConfig.filter(
    (item) => specs[item.key] !== undefined && specs[item.key] !== ''
  );

  if (availableSpecs.length === 0) return null;

  const visibleSpecs = isExpanded ? availableSpecs : availableSpecs.slice(0, 4);

  return (
    <Card className="border-0 bg-transparent shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="flex items-center gap-3 text-2xl font-bold">
          <div className="bg-primary/10 rounded-lg p-2">
            <Settings className="text-primary h-6 w-6" />
          </div>
          {t('title')}
        </CardTitle>
        <p className="text-muted-foreground mt-2">{t('subtitle')}</p>
      </CardHeader>
      <CardContent className="px-0">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {visibleSpecs.map((item) => {
            const Icon = item.icon;
            const value = specs[item.key];

            return (
              <div
                key={item.key}
                className="group bg-card hover:bg-muted/50 relative flex items-start gap-4 rounded-xl border p-4 transition-colors"
              >
                <div className="bg-muted group-hover:bg-background flex-shrink-0 rounded-lg p-3 transition-colors">
                  <Icon className="text-muted-foreground h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    {t(item.key)}
                  </p>
                  <p className="mt-1 truncate text-lg font-semibold">{value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {availableSpecs.length > 4 && (
          <div className="mt-6 flex justify-center">
            <Button
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
              className="gap-2"
            >
              {isExpanded ? (
                <>
                  {t('showLess')}
                  <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  {t('viewAll')}
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}

        {/* Description Section */}
        {description && (
          <div className="bg-muted/30 mt-8 rounded-xl p-6">
            <h4 className="mb-3 text-lg font-semibold">
              {t('productDetails')}
            </h4>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
