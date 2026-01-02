export interface ProductSpecs {
  caseMaterial?: string;
  caseDiameter?: string;
  movement?: string;
  waterResistance?: string;
  crystal?: string;
  strapMaterial?: string;
  warranty?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  sale_price: number | null;
  description: string | null;
  specs_json: ProductSpecs | null;
  image_url: string | null;
  images: string[];
  stock_status: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProductDto {
  name: string;
  slug: string;
  brand: string;
  price: number;
  sale_price?: number | null;
  description?: string | null;
  specs_json?: ProductSpecs | null;
  image_url?: string | null;
  images?: string[];
  stock_status?: boolean;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface FilterParams {
  brands?: string[];
  priceMin?: number;
  priceMax?: number;
}
