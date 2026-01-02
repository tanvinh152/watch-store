'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Edit, Trash2, Watch } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Product } from '@/types';
import { DeleteDialog } from './delete-dialog';
import { useState } from 'react';
import { productService } from '@/services';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products: initialProducts }: ProductTableProps) {
  const router = useRouter();
  const t = useTranslations('AdminProducts');
  const [products, setProducts] = useState(initialProducts);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await productService.delete(deleteId);
      setProducts(products.filter((p) => p.id !== deleteId));
      toast.success('Product deleted successfully');
      setDeleteId(null);
      router.refresh();
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]"></TableHead>
              <TableHead>{t('productName')}</TableHead>
              <TableHead>{t('brand')}</TableHead>
              <TableHead>{t('price')}</TableHead>
              <TableHead>{t('stock')}</TableHead>
              <TableHead className="w-[100px]">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-muted-foreground py-8 text-center"
                >
                  {t('noProducts')}
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="bg-muted relative h-12 w-12 overflow-hidden rounded">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Watch className="text-muted-foreground h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{formatPrice(product.price)}</span>
                      {product.sale_price && (
                        <span className="text-xs text-green-600">
                          {t('salePrice')}: {formatPrice(product.sale_price)}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={product.stock_status ? 'default' : 'secondary'}
                    >
                      {product.stock_status ? t('inStock') : t('outOfStock')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DeleteDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title={t('deleteConfirm')}
        description={t('deleteDescription')}
      />
    </>
  );
}
