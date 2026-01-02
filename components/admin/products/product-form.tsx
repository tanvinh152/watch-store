'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { productSchema, ProductFormData } from '@/schemas';
import { Product, CreateProductDto } from '@/types';
import { productService, storageService } from '@/services';
import { ImageUploader, ImageFile } from './image-uploader';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

interface ProductFormProps {
  product?: Product;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const t = useTranslations('AdminProducts');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize images from existing product
  const initialImages: ImageFile[] = (product?.images || [])
    .filter((url) => url)
    .map((url, index) => ({
      id: `existing-${index}`,
      url,
      isExisting: true,
    }));

  // Fallback to image_url if images array is empty
  if (initialImages.length === 0 && product?.image_url) {
    initialImages.push({
      id: 'existing-0',
      url: product.image_url,
      isExisting: true,
    });
  }

  const [images, setImages] = useState<ImageFile[]>(initialImages);

  const isEditing = !!product;

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      brand: product?.brand || '',
      price: product?.price || 0,
      salePrice: product?.sale_price || null,
      description: product?.description || '',
      stockStatus: product?.stock_status ?? true,
      specs: {
        caseMaterial: product?.specs_json?.caseMaterial || '',
        caseDiameter: product?.specs_json?.caseDiameter || '',
        movement: product?.specs_json?.movement || '',
        waterResistance: product?.specs_json?.waterResistance || '',
        crystal: product?.specs_json?.crystal || '',
        strapMaterial: product?.specs_json?.strapMaterial || '',
        warranty: product?.specs_json?.warranty || '',
      },
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);

    try {
      // Separate existing images from new ones
      const existingImages = images.filter((img) => img.isExisting);
      const newImages = images.filter((img) => !img.isExisting && img.file);

      // Upload new images
      let uploadedUrls: string[] = [];
      if (newImages.length > 0) {
        toast.info(t('uploadingImages', { count: newImages.length }));
        const filesToUpload = newImages.map((img) => img.file!);
        uploadedUrls = await storageService.uploadMultipleImages(filesToUpload);
      }

      // Combine existing and newly uploaded image URLs in order
      const allImageUrls: string[] = [];
      let uploadIndex = 0;

      images.forEach((img) => {
        if (img.isExisting && img.url) {
          allImageUrls.push(img.url);
        } else if (!img.isExisting && uploadedUrls[uploadIndex]) {
          allImageUrls.push(uploadedUrls[uploadIndex]);
          uploadIndex++;
        }
      });

      // Find images to delete (existing images that were removed)
      if (isEditing) {
        const originalUrls =
          product.images || (product.image_url ? [product.image_url] : []);
        const currentExistingUrls = existingImages
          .map((img) => img.url)
          .filter(Boolean) as string[];
        const urlsToDelete = originalUrls.filter(
          (url) => !currentExistingUrls.includes(url)
        );

        if (urlsToDelete.length > 0) {
          try {
            await storageService.deleteMultipleImages(urlsToDelete);
          } catch (error) {
            console.error('Failed to delete old images:', error);
            // Continue anyway, as this is not critical
          }
        }
      }

      const slug = isEditing ? product.slug : generateSlug(data.name);

      const dto: CreateProductDto = {
        name: data.name,
        slug,
        brand: data.brand,
        price: data.price,
        sale_price: data.salePrice || null,
        description: data.description || null,
        specs_json: data.specs || null,
        image_url: allImageUrls[0] || null, // First image as main image
        images: allImageUrls,
        stock_status: data.stockStatus,
      };

      if (isEditing) {
        await productService.update(product.id, dto);
        toast.success(t('productUpdated'));
      } else {
        await productService.create(dto);
        toast.success(t('productCreated'));
      }

      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error(isEditing ? t('updateFailed') : t('createFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Info */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('productInformation')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('productNameLabel')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('productNamePlaceholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('brandLabel')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('brandPlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('regularPrice')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder={t('pricePlaceholder')}
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="salePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('salePriceLabel')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder={t('pricePlaceholder')}
                            {...field}
                            value={field.value || ''}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseFloat(e.target.value)
                                  : null
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('productDescription')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('descriptionPlaceholder')}
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stockStatus"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{t('inStockLabel')}</FormLabel>
                        <FormDescription>
                          {t('inStockDescription')}
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>{t('specifications')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="specs.caseMaterial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('caseMaterial')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('caseMaterialPlaceholder')}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specs.caseDiameter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('caseDiameter')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('caseDiameterPlaceholder')}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specs.movement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('movement')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('movementPlaceholder')}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specs.waterResistance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('waterResistance')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('waterResistancePlaceholder')}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specs.crystal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('crystal')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('crystalPlaceholder')}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specs.strapMaterial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('strapMaterial')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('strapMaterialPlaceholder')}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specs.warranty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('warranty')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('warrantyPlaceholder')}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>{t('productImages')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploader
                  images={images}
                  onChange={setImages}
                  maxImages={5}
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="space-y-4 pt-6">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditing ? t('updating') : t('creating')}
                    </>
                  ) : isEditing ? (
                    t('updateProduct')
                  ) : (
                    t('createProduct')
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/admin/products')}
                  disabled={isSubmitting}
                >
                  {t('cancel')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
