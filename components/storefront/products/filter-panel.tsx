'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { useDebounce, useFilters } from '@/hooks';
import { formatPrice } from '@/lib/utils';
import { productService } from '@/services';
import { Filter, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface FilterContentProps {
  brands: string[];
  selectedBrands: string[];
  toggleBrand: (brand: string) => void;
  minPrice: string;
  setMinPrice: (value: string) => void;
  maxPrice: string;
  setMaxPrice: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  hasActiveFilters: boolean;
  clearFilters: () => void;
  t: ReturnType<typeof useTranslations>;
}

const FilterContent = ({
  brands,
  selectedBrands,
  toggleBrand,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  searchQuery,
  setSearchQuery,
  hasActiveFilters,
  clearFilters,
  t,
}: FilterContentProps) => (
  <div className="space-y-6">
    {/* Search */}
    <div>
      <h3 className="mb-3 font-semibold">{t('search')}</h3>
      <div className="relative">
        <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
        <Input
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>
    </div>

    <Separator />

    {/* Brands */}
    <div>
      <h3 className="mb-3 font-semibold">{t('brand')}</h3>
      <div className="space-y-2">
        {brands.map((brand) => (
          <div key={brand} className="flex items-center gap-2">
            <Checkbox
              id={`brand-${brand}`}
              checked={selectedBrands.includes(brand)}
              onCheckedChange={() => toggleBrand(brand)}
            />
            <Label
              htmlFor={`brand-${brand}`}
              className="cursor-pointer text-sm font-normal"
            >
              {brand}
            </Label>
          </div>
        ))}
      </div>
    </div>

    <Separator />

    {/* Price Range */}
    <div>
      <h3 className="mb-3 font-semibold">{t('priceRange')}</h3>
      <div className="space-y-4">
        <Slider
          defaultValue={[0, 50000000]}
          min={0}
          max={50000000}
          step={10}
          value={[
            minPrice ? parseInt(minPrice) : 0,
            maxPrice ? parseInt(maxPrice) : 50000000,
          ]}
          onValueChange={([min, max]) => {
            setMinPrice(min.toString());
            setMaxPrice(max.toString());
          }}
          className="my-4"
        />
        <div className="flex items-center justify-between">
          <div className="bg-secondary rounded-md px-2 py-1 text-sm">
            {formatPrice(minPrice ? parseInt(minPrice) : 0)}
          </div>
          <div className="bg-secondary rounded-md px-2 py-1 text-sm">
            {formatPrice(maxPrice ? parseInt(maxPrice) : 50000000)}
          </div>
        </div>
      </div>
    </div>

    {hasActiveFilters && (
      <>
        <Separator />
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={() => {
            clearFilters();
            setMinPrice('0');
            setMaxPrice('');
            setSearchQuery('');
          }}
        >
          <X className="h-4 w-4" />
          {t('clearFilters')}
        </Button>
      </>
    )}
  </div>
);

export function FilterPanel() {
  const {
    selectedBrands,
    priceRange,
    searchQuery: globalSearchQuery,
    hasActiveFilters,
    toggleBrand,
    setPriceRange,
    setSearchQuery: setGlobalSearchQuery,
    clearFilters,
  } = useFilters();
  const t = useTranslations('FilterPanel');

  const [brands, setBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(priceRange.min.toString());
  const [maxPrice, setMaxPrice] = useState(priceRange.max?.toString() || '');
  const [searchQuery, setSearchQuery] = useState(globalSearchQuery);

  const debouncedMinPrice = useDebounce(minPrice, 500);
  const debouncedMaxPrice = useDebounce(maxPrice, 500);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    productService.getBrands().then(setBrands);
  }, []);

  useEffect(() => {
    const min = debouncedMinPrice ? parseFloat(debouncedMinPrice) : 0;
    const max = debouncedMaxPrice ? parseFloat(debouncedMaxPrice) : null;
    setPriceRange({ min, max });
  }, [debouncedMinPrice, debouncedMaxPrice, setPriceRange]);

  useEffect(() => {
    setGlobalSearchQuery(debouncedSearchQuery);
  }, [debouncedSearchQuery, setGlobalSearchQuery]);

  return (
    <>
      {/* Desktop Filter */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-20 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t('title')}</h2>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  clearFilters();
                  setMinPrice('0');
                  setMaxPrice('');
                  setSearchQuery('');
                }}
              >
                {t('clearAll')}
              </Button>
            )}
          </div>
          <FilterContent
            brands={brands}
            selectedBrands={selectedBrands}
            toggleBrand={toggleBrand}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            hasActiveFilters={hasActiveFilters}
            clearFilters={clearFilters}
            t={t}
          />
        </div>
      </aside>

      {/* Mobile Filter */}
      <Sheet>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            {t('title')}
            {hasActiveFilters && (
              <span className="bg-primary text-primary-foreground ml-1 flex h-5 w-5 items-center justify-center rounded-full text-xs">
                {selectedBrands.length +
                  (priceRange.max ? 1 : 0) +
                  (searchQuery ? 1 : 0)}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px]">
          <SheetHeader>
            <SheetTitle>{t('title')}</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent
              brands={brands}
              selectedBrands={selectedBrands}
              toggleBrand={toggleBrand}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              hasActiveFilters={hasActiveFilters}
              clearFilters={clearFilters}
              t={t}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
