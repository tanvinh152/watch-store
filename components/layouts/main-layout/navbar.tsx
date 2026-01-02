'use client';

import { Link, usePathname } from '@/i18n/routing';
import { ShoppingCart, Menu, Watch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks';
import { useState } from 'react';
import { CartDrawer } from '@/components/storefront/cart/cart-drawer';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/language-switcher';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'home' },
  { href: '/products', label: 'products' },
];

export function Navbar() {
  const { count, isOpen, toggle } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations('Navbar');
  const pathname = usePathname();

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Watch className="h-6 w-6" />
          <span className="text-xl font-bold">Watch Store</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'hover:text-primary text-sm font-medium transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {t(link.label)}
              </Link>
            );
          })}
        </nav>

        {/* Cart & Mobile Menu */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>

          {/* Cart Button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={toggle}
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
              >
                {count}
              </Badge>
            )}
          </Button>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <div className="mt-8 flex flex-col gap-4">
                <div className="mb-4">
                  <LanguageSwitcher />
                </div>
                {navLinks.map((link) => {
                  const isActive =
                    link.href === '/'
                      ? pathname === '/'
                      : pathname.startsWith(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'hover:text-primary text-lg font-medium transition-colors',
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      )}
                      onClick={() => setMobileOpen(false)}
                    >
                      {t(link.label)}
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer open={isOpen} onClose={toggle} />
    </header>
  );
}
