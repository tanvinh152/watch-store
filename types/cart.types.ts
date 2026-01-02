export interface CartItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

