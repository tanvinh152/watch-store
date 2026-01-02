import { z } from 'zod';

export const orderStatusSchema = z.enum([
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
]);

export const orderStatusUpdateSchema = z.object({
  status: orderStatusSchema,
});

export type OrderStatusUpdateData = z.infer<typeof orderStatusUpdateSchema>;

