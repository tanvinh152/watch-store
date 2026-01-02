'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Watch, ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  
  // Filter out empty/null images
  const validImages = images.filter((img) => img);
  
  if (validImages.length === 0) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-muted to-muted/50 border">
        <div className="flex h-full flex-col items-center justify-center gap-4">
          <div className="p-6 bg-muted-foreground/5 rounded-full">
            <Watch className="h-20 w-20 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground text-sm">No image available</p>
        </div>
      </div>
    );
  }

  const currentImage = validImages[selectedIndex] || validImages[0];
  const hasMultipleImages = validImages.length > 1;

  const goToPrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  }, [validImages.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  }, [validImages.length]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Escape') setIsZoomed(false);
  }, [goToPrevious, goToNext]);

  return (
    <>
      <div className="space-y-4" onKeyDown={handleKeyDown} tabIndex={0}>
        {/* Main Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-muted/50 to-muted border group">
          {/* Main Image with Zoom on Hover */}
          <div
            className="relative w-full h-full cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
          >
            <Image
              src={currentImage}
              alt={`${productName} - Image ${selectedIndex + 1}`}
              fill
              className={cn(
                'object-contain transition-transform duration-300',
                isZoomed && 'scale-150'
              )}
              style={isZoomed ? {
                transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
              } : undefined}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          
          {/* Zoom Indicator */}
          <div className="absolute top-4 right-4 bg-black/60 text-white text-xs px-3 py-2 rounded-full flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <ZoomIn className="h-3 w-3" />
            Hover to zoom
          </div>
          
          {/* Navigation Arrows */}
          {hasMultipleImages && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all h-12 w-12 rounded-full bg-white/90 hover:bg-white shadow-lg"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all h-12 w-12 rounded-full bg-white/90 hover:bg-white shadow-lg"
                onClick={goToNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}
          
          {/* Image Counter */}
          {hasMultipleImages && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full font-medium">
              {selectedIndex + 1} / {validImages.length}
            </div>
          )}
        </div>

        {/* Thumbnails Grid */}
        {hasMultipleImages && (
          <div className="grid grid-cols-5 gap-3">
            {validImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  'relative aspect-square overflow-hidden rounded-xl bg-muted transition-all duration-200',
                  selectedIndex === index
                    ? 'ring-2 ring-primary ring-offset-2 shadow-md scale-[1.02]'
                    : 'hover:ring-2 hover:ring-muted-foreground/30 hover:ring-offset-1 opacity-70 hover:opacity-100'
                )}
              >
                <Image
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              </button>
            ))}
          </div>
        )}

        {/* Dot Indicators for Mobile */}
        {hasMultipleImages && (
          <div className="flex justify-center gap-2 md:hidden">
            {validImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  selectedIndex === index
                    ? 'bg-primary w-6'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                )}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
