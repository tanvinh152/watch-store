'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  Watch,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
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
    <aside className="bg-muted/40 hidden w-64 flex-col border-r md:flex">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin" className="flex items-center gap-2">
          <Watch className="h-6 w-6" />
          <span className="text-lg font-bold">{t('adminPanel')}</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
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

      {/* Logout */}
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
    </aside>
  );
}
