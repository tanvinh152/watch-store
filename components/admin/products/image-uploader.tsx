'use client';

import { useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, Watch, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export interface ImageFile {
  id: string;
  file?: File;
  url?: string;
  isExisting: boolean;
}

interface ImageUploaderProps {
  images: ImageFile[];
  onChange: (images: ImageFile[]) => void;
  maxImages?: number;
}

export function ImageUploader({
  images,
  onChange,
  maxImages = 5,
}: ImageUploaderProps) {
  const t = useTranslations('ImageUploader');

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      const remainingSlots = maxImages - images.length;
      if (remainingSlots <= 0) {
        toast.error(t('maxImagesError', { maxImages }));
        return;
      }

      const filesToAdd = files.slice(0, remainingSlots);
      const invalidFiles: string[] = [];
      const validFiles: ImageFile[] = [];

      filesToAdd.forEach((file) => {
        // Validate file type
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
          invalidFiles.push(file.name);
          return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
          invalidFiles.push(`${file.name} (${t('tooLarge')})`);
          return;
        }

        validFiles.push({
          id: `new-${Date.now()}-${Math.random().toString(36).substring(2)}`,
          file,
          url: URL.createObjectURL(file),
          isExisting: false,
        });
      });

      if (invalidFiles.length > 0) {
        toast.error(t('invalidFiles', { files: invalidFiles.join(', ') }));
      }

      if (validFiles.length > 0) {
        onChange([...images, ...validFiles]);
      }

      // Reset input
      e.target.value = '';
    },
    [images, onChange, maxImages, t]
  );

  const handleRemove = useCallback(
    (id: string) => {
      const imageToRemove = images.find((img) => img.id === id);
      if (imageToRemove && !imageToRemove.isExisting && imageToRemove.url) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      onChange(images.filter((img) => img.id !== id));
    },
    [images, onChange]
  );

  const moveImage = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (toIndex < 0 || toIndex >= images.length) return;
      const newImages = [...images];
      const [movedImage] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, movedImage);
      onChange(newImages);
    },
    [images, onChange]
  );

  const canAddMore = images.length < maxImages;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="group bg-muted relative aspect-square overflow-hidden rounded-lg border"
          >
            {image.url ? (
              <Image
                src={image.url}
                alt={t('productImageAlt', { index: index + 1 })}
                fill
                className="object-cover"
                sizes="150px"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Watch className="text-muted-foreground h-8 w-8" />
              </div>
            )}

            {/* Image number badge */}
            <div className="absolute top-2 left-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
              {index === 0 ? t('main') : index + 1}
            </div>

            {/* Controls overlay */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              {index > 0 && (
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => moveImage(index, index - 1)}
                  title={t('moveLeft')}
                >
                  ←
                </Button>
              )}
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleRemove(image.id)}
                title={t('remove')}
              >
                <X className="h-4 w-4" />
              </Button>
              {index < images.length - 1 && (
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => moveImage(index, index + 1)}
                  title={t('moveRight')}
                >
                  →
                </Button>
              )}
            </div>

            {/* Pending upload indicator */}
            {!image.isExisting && (
              <div className="absolute right-2 bottom-2 rounded bg-yellow-500 px-2 py-1 text-xs text-white">
                {t('pending')}
              </div>
            )}
          </div>
        ))}

        {/* Upload button */}
        {canAddMore && (
          <label className="border-muted-foreground/25 hover:border-muted-foreground/50 flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
              multiple
            />
            <Upload className="text-muted-foreground mb-2 h-8 w-8" />
            <span className="text-muted-foreground px-2 text-center text-sm">
              {t('addImages')}
            </span>
            <span className="text-muted-foreground mt-1 text-xs">
              {t('imageCount', { current: images.length, max: maxImages })}
            </span>
          </label>
        )}
      </div>

      <p className="text-muted-foreground text-xs">
        {t('fileInfo')}
        {images.filter((img) => !img.isExisting).length > 0 && (
          <span className="ml-1 text-yellow-600">
            ({images.filter((img) => !img.isExisting).length}{' '}
            {t('pendingUpload')})
          </span>
        )}
      </p>
    </div>
  );
}
