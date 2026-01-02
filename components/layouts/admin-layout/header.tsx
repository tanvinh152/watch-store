'use client';

import { LanguageSwitcher } from '@/components/language-switcher';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingCart,
  Watch,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut, user } = useAuth();
  const [open, setOpen] = useState(false);
  const t = useTranslations('AdminSidebar');

  const navItems = [
    {
      href: '/admin',
      label: t('dashboard'),
      icon: LayoutDashboard,
    },
    {
      href: '/admin/products',
      label: t('products'),
      icon: Package,
    },
    {
      href: '/admin/orders',
      label: t('orders'),
      icon: ShoppingCart,
    },
  ];

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <header className="bg-background sticky top-0 z-50 flex h-16 items-center justify-between border-b px-4 md:px-6">
      {/* Mobile Menu */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/admin" className="flex items-center gap-2">
              <Watch className="h-6 w-6" />
              <span className="text-lg font-bold">{t('adminPanel')}</span>
            </Link>
          </div>
          <nav className="space-y-1 p-4">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t p-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              {t('logout')}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Title - Hidden on mobile, shown on desktop */}
      <div className="hidden md:block" />

      {/* User info & Logout (desktop) */}
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <span className="text-muted-foreground hidden text-sm sm:inline">
          {user?.email}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="hidden gap-2 md:flex"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {t('logout')}
        </Button>
      </div>
    </header>
  );
}
