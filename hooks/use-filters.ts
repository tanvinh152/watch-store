'use client';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import {
  toggleBrand,
  setBrands,
  setPriceRange,
  setSearchQuery,
  clearFilters,
} from '@/store/slices/filter.slice';
import {
  selectSelectedBrands,
  selectPriceRange,
  selectSearchQuery,
  selectHasActiveFilters,
} from '@/store/selectors';

export function useFilters() {
  const dispatch = useDispatch<AppDispatch>();
  const selectedBrands = useSelector(selectSelectedBrands);
  const priceRange = useSelector(selectPriceRange);
  const searchQuery = useSelector(selectSearchQuery);
  const hasActiveFilters = useSelector(selectHasActiveFilters);

  const handleToggleBrand = (brand: string) => {
    dispatch(toggleBrand(brand));
  };

  const handleSetBrands = (brands: string[]) => {
    dispatch(setBrands(brands));
  };

  const handleSetPriceRange = (range: {
    min?: number;
    max?: number | null;
  }) => {
    dispatch(setPriceRange(range));
  };

  const handleSetSearchQuery = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  return {
    selectedBrands,
    priceRange,
    searchQuery,
    hasActiveFilters,
    toggleBrand: handleToggleBrand,
    setBrands: handleSetBrands,
    setPriceRange: handleSetPriceRange,
    setSearchQuery: handleSetSearchQuery,
    clearFilters: handleClearFilters,
  };
}
