'use client';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import {
  toggleBrand,
  setBrands,
  setPriceRange,
  clearFilters,
} from '@/store/slices/filter.slice';
import {
  selectSelectedBrands,
  selectPriceRange,
  selectHasActiveFilters,
} from '@/store/selectors';

export function useFilters() {
  const dispatch = useDispatch<AppDispatch>();
  const selectedBrands = useSelector(selectSelectedBrands);
  const priceRange = useSelector(selectPriceRange);
  const hasActiveFilters = useSelector(selectHasActiveFilters);

  const handleToggleBrand = (brand: string) => {
    dispatch(toggleBrand(brand));
  };

  const handleSetBrands = (brands: string[]) => {
    dispatch(setBrands(brands));
  };

  const handleSetPriceRange = (range: { min?: number; max?: number | null }) => {
    dispatch(setPriceRange(range));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  return {
    selectedBrands,
    priceRange,
    hasActiveFilters,
    toggleBrand: handleToggleBrand,
    setBrands: handleSetBrands,
    setPriceRange: handleSetPriceRange,
    clearFilters: handleClearFilters,
  };
}

