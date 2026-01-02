'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { checkoutSchema, CheckoutFormData } from '@/schemas';
import { useCart } from '@/hooks';
import { orderService } from '@/services';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export function CheckoutForm() {
  const router = useRouter();
  const { items, total, emptyCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations('Checkout');

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: '',
      phone: '',
      email: '',
      address: {
        street: '',
        ward: '',
        district: '',
        city: '',
      },
      paymentMethod: 'cod',
      notes: '',
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error(t('cartEmpty'));
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order
      const order = await orderService.create({
        customer_info: {
          name: data.customerName,
          phone: data.phone,
          email: data.email || undefined,
          address: data.address,
        },
        total_amount: total,
        payment_method: data.paymentMethod,
        notes: data.notes || null,
      });

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price_at_purchase: item.price,
      }));

      await orderService.createOrderItems(orderItems);

      // Clear cart and redirect
      emptyCart();
      router.push(`/order-success?orderId=${order.id}`);
      toast.success(t('orderSuccess'));
    } catch (error) {
      console.error('Order submission failed:', error);
      toast.error(t('orderFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('shippingInfo')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Contact Info */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('fullName')} *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('fullNamePlaceholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('phone')} *</FormLabel>
                    <FormControl>
                      <Input placeholder={t('phonePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('email')}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t('emailPlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address.street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('street')} *</FormLabel>
                  <FormControl>
                    <Input placeholder={t('streetPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="address.ward"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('ward')} *</FormLabel>
                    <FormControl>
                      <Input placeholder={t('wardPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('district')} *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('districtPlaceholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('city')} *</FormLabel>
                    <FormControl>
                      <Input placeholder={t('cityPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Payment Method */}
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('paymentMethod')} *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectPaymentMethod')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cod">{t('cod')}</SelectItem>
                      <SelectItem value="bank_transfer">
                        {t('bankTransfer')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('orderNotes')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('orderNotesPlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting || items.length === 0}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('placingOrder')}
                </>
              ) : (
                `${t('placeOrder')} - ${formatPrice(total)}`
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
