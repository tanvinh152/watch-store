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
  ChevronUp
} from 'lucide-react';
import { ProductSpecs as ProductSpecsType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductSpecsProps {
  specs: ProductSpecsType | null;
  description?: string | null;
}

interface SpecItem {
  key: keyof ProductSpecsType;
  label: string;
  icon: React.ElementType;
  description: string;
}

const specConfig: SpecItem[] = [
  { 
    key: 'caseMaterial', 
    label: 'Case Material', 
    icon: Watch,
    description: 'The material used in constructing the watch case'
  },
  { 
    key: 'caseDiameter', 
    label: 'Case Diameter', 
    icon: Gauge,
    description: 'The width of the watch case measured in millimeters'
  },
  { 
    key: 'movement', 
    label: 'Movement', 
    icon: Settings,
    description: 'The type of mechanism that powers the watch'
  },
  { 
    key: 'waterResistance', 
    label: 'Water Resistance', 
    icon: Droplets,
    description: 'The level of protection against water exposure'
  },
  { 
    key: 'crystal', 
    label: 'Crystal', 
    icon: Gem,
    description: 'The transparent cover protecting the dial'
  },
  { 
    key: 'strapMaterial', 
    label: 'Strap Material', 
    icon: Ribbon,
    description: 'The material used for the watch band'
  },
  { 
    key: 'warranty', 
    label: 'Warranty', 
    icon: Award,
    description: 'Manufacturer warranty coverage period'
  },
];

export function ProductSpecs({ specs, description }: ProductSpecsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!specs) return null;

  const availableSpecs = specConfig.filter(
    (item) => specs[item.key] !== undefined && specs[item.key] !== ''
  );

  if (availableSpecs.length === 0) return null;

  const visibleSpecs = isExpanded ? availableSpecs : availableSpecs.slice(0, 4);

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl font-bold flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          Technical Specifications
        </CardTitle>
        <p className="text-muted-foreground mt-2">
          Every detail matters. Explore the precise specifications that make this timepiece exceptional.
        </p>
      </CardHeader>
      <CardContent className="px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleSpecs.map((item) => {
            const Icon = item.icon;
            const value = specs[item.key];
            
            return (
              <div
                key={item.key}
                className="group relative flex items-start gap-4 p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex-shrink-0 p-3 bg-muted rounded-lg group-hover:bg-background transition-colors">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                    {item.label}
                  </p>
                  <p className="text-lg font-semibold mt-1 truncate">
                    {value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {availableSpecs.length > 4 && (
          <div className="flex justify-center mt-6">
            <Button
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
              className="gap-2"
            >
              {isExpanded ? (
                <>
                  Show Less
                  <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  View All Specifications
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}

        {/* Description Section */}
        {description && (
          <div className="mt-8 p-6 bg-muted/30 rounded-xl">
            <h4 className="font-semibold text-lg mb-3">Product Details</h4>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
