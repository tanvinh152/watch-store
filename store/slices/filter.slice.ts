import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  selectedBrands: string[];
  priceRange: {
    min: number;
    max: number | null;
  };
  searchQuery: string;
}

const initialState: FilterState = {
  selectedBrands: [],
  priceRange: {
    min: 0,
    max: null,
  },
  searchQuery: '',
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    toggleBrand: (state, action: PayloadAction<string>) => {
      const index = state.selectedBrands.indexOf(action.payload);
      if (index === -1) {
        state.selectedBrands.push(action.payload);
      } else {
        state.selectedBrands.splice(index, 1);
      }
    },
    setBrands: (state, action: PayloadAction<string[]>) => {
      state.selectedBrands = action.payload;
    },
    setPriceRange: (
      state,
      action: PayloadAction<{ min?: number; max?: number | null }>
    ) => {
      if (action.payload.min !== undefined) {
        state.priceRange.min = action.payload.min;
      }
      if (action.payload.max !== undefined) {
        state.priceRange.max = action.payload.max;
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearFilters: (state) => {
      state.selectedBrands = [];
      state.priceRange = { min: 0, max: null };
      state.searchQuery = '';
    },
  },
});

export const {
  toggleBrand,
  setBrands,
  setPriceRange,
  setSearchQuery,
  clearFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
