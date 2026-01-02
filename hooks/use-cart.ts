'use client';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
} from '@/store/slices/cart.slice';
import {
  selectCartItems,
  selectCartCount,
  selectCartTotal,
  selectIsCartOpen,
} from '@/store/selectors';
import { CartItem } from '@/types';
import { Product } from '@/types';

export function useCart() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectCartItems);
  const count = useSelector(selectCartCount);
  const total = useSelector(selectCartTotal);
  const isOpen = useSelector(selectIsCartOpen);

  const addToCart = (product: Product, quantity: number = 1) => {
    const cartItem: CartItem = {
      productId: product.id,
      name: product.name,
      brand: product.brand,
      price: product.sale_price ?? product.price,
      imageUrl: product.image_url,
      quantity,
    };
    dispatch(addItem(cartItem));
  };

  const removeFromCart = (productId: string) => {
    dispatch(removeItem(productId));
  };

  const updateItemQuantity = (productId: string, quantity: number) => {
    dispatch(updateQuantity({ productId, quantity }));
  };

  const emptyCart = () => {
    dispatch(clearCart());
  };

  const toggle = () => {
    dispatch(toggleCart());
  };

  const open = () => {
    dispatch(openCart());
  };

  const close = () => {
    dispatch(closeCart());
  };

  return {
    items,
    count,
    total,
    isOpen,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    emptyCart,
    toggle,
    open,
    close,
  };
}

