import { RootState } from './index';

// Cart selectors
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectIsCartOpen = (state: RootState) => state.cart.isOpen;
export const selectCartCount = (state: RootState) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);
export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

// Filter selectors
export const selectSelectedBrands = (state: RootState) =>
  state.filter.selectedBrands;
export const selectPriceRange = (state: RootState) => state.filter.priceRange;
export const selectHasActiveFilters = (state: RootState) =>
  state.filter.selectedBrands.length > 0 ||
  state.filter.priceRange.min > 0 ||
  state.filter.priceRange.max !== null;

// UI selectors
export const selectIsMobileMenuOpen = (state: RootState) =>
  state.ui.isMobileMenuOpen;
export const selectActiveModal = (state: RootState) => state.ui.activeModal;
export const selectGlobalLoading = (state: RootState) => state.ui.globalLoading;

