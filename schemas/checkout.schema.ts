import { z } from 'zod';

export const addressSchema = z.object({
  street: z
    .string()
    .min(5, 'Street address must be at least 5 characters')
    .max(200, 'Street address must be under 200 characters'),
  ward: z.string().min(1, 'Ward is required'),
  district: z.string().min(1, 'District is required'),
  city: z.string().min(1, 'City is required'),
});

export const checkoutSchema = z.object({
  customerName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be under 100 characters'),
  phone: z
    .string()
    .regex(/^[0-9]{10,11}$/, 'Please enter a valid phone number (10-11 digits)'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  address: addressSchema,
  paymentMethod: z.enum(['cod', 'bank_transfer'], {
    message: 'Please select a payment method',
  }),
  notes: z.string().max(500, 'Notes must be under 500 characters').optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

