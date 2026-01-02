import { z } from 'zod';

export const productSpecsSchema = z.object({
  caseMaterial: z.string().max(100).optional(),
  caseDiameter: z.string().max(50).optional(),
  movement: z.string().max(100).optional(),
  waterResistance: z.string().max(50).optional(),
  crystal: z.string().max(100).optional(),
  strapMaterial: z.string().max(100).optional(),
  warranty: z.string().max(100).optional(),
});

export const productSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(255, 'Name must be under 255 characters'),
  brand: z
    .string()
    .min(1, 'Brand is required')
    .max(100, 'Brand must be under 100 characters'),
  price: z
    .number({ message: 'Price is required' })
    .positive('Price must be greater than 0'),
  salePrice: z.number().positive().nullable().optional(),
  description: z.string().max(5000, 'Description is too long').optional(),
  stockStatus: z.boolean(),
  specs: productSpecsSchema.optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

export const productFilterSchema = z.object({
  brands: z.array(z.string()).optional(),
  priceMin: z.number().min(0, 'Minimum price cannot be negative').optional(),
  priceMax: z.number().optional(),
});

export type ProductFilterData = z.infer<typeof productFilterSchema>;
