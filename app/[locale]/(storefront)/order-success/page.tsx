'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Home, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/hooks';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { emptyCart } = useCart();
  const hasCleared = useRef(false);

  useEffect(() => {
    // Only clear cart once when component mounts
    if (!hasCleared.current) {
      hasCleared.current = true;
      emptyCart();
    }
  }, [emptyCart]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for your order. We&apos;ll process it shortly.
        </p>

        {orderId && (
          <Card className="mb-8 text-left">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-mono text-sm">{orderId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">What&apos;s Next?</p>
                <ul className="text-sm space-y-1 mt-1">
                  <li>• We will confirm your order shortly</li>
                  <li>• You&apos;ll receive updates about your order status</li>
                  <li>• For COD orders, payment is due upon delivery</li>
                  <li>• For bank transfer, please complete the payment to proceed</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
