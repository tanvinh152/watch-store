import { createClient } from '@/lib/supabase/client';
import {
  Product,
  CreateProductDto,
  UpdateProductDto,
  FilterParams,
} from '@/types';

const supabase = createClient();

export const productService = {
  async getAll(filters?: FilterParams): Promise<Product[]> {
    let query = supabase
      .from('products')
      .select('*')
      .eq('stock_status', true)
      .order('created_at', { ascending: false });

    if (filters?.brands && filters.brands.length > 0) {
      query = query.in('brand', filters.brands);
    }

    if (filters?.priceMin !== undefined) {
      query = query.gte('price', filters.priceMin);
    }

    if (filters?.priceMax !== undefined) {
      query = query.lte('price', filters.priceMax);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async getAllAdmin(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  async getBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  async getFeatured(limit: number = 8): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('stock_status', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  async getBrands(): Promise<string[]> {
    const { data, error } = await supabase
      .from('products')
      .select('brand')
      .eq('stock_status', true);

    if (error) throw error;

    const brands = [...new Set(data?.map((p) => p.brand) || [])];
    return brands.sort();
  },

  async create(dto: CreateProductDto): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert(dto)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) throw error;
  },
};

