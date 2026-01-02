import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Home, ArrowLeft, Watch } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import {
  ProductGallery,
  ProductInfo,
  ProductSpecs,
} from '@/components/storefront/products';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string): Promise<Product | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
}

// Get products from the same brand (excluding current product)
async function getSameBrandProducts(
  brand: string,
  currentId: string,
  limit: number = 4
): Promise<Product[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('brand', brand)
    .neq('id', currentId)
    .eq('stock_status', true)
    .limit(limit);

  if (error) {
    console.error('Error fetching same brand products:', error);
    return [];
  }

  return data || [];
}

// Get products in a similar price range (±30% of current price)
async function getSimilarPriceProducts(
  price: number,
  currentId: string,
  excludeIds: string[],
  limit: number = 4
): Promise<Product[]> {
  const supabase = await createServerSupabaseClient();

  const minPrice = price * 0.7;
  const maxPrice = price * 1.3;

  // Get all products that need to be excluded
  const allExcludeIds = [currentId, ...excludeIds];

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .gte('price', minPrice)
    .lte('price', maxPrice)
    .eq('stock_status', true)
    .not('id', 'in', `(${allExcludeIds.join(',')})`)
    .order('price', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching similar price products:', error);
    return [];
  }

  return data || [];
}

// Get random/popular products as fallback
async function getOtherProducts(
  currentId: string,
  excludeIds: string[],
  limit: number = 4
): Promise<Product[]> {
  const supabase = await createServerSupabaseClient();

  const allExcludeIds = [currentId, ...excludeIds];

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('stock_status', true)
    .not('id', 'in', `(${allExcludeIds.join(',')})`)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching other products:', error);
    return [];
  }

  return data || [];
}

// Product Card Component
function ProductCard({ product }: { product: Product }) {
  const displayPrice = product.sale_price ?? product.price;
  const hasDiscount = product.sale_price !== null;

  return (
    <Link href={`/products/${product.id}`} className="group">
      <Card className="bg-card overflow-hidden border-0 shadow-sm transition-all duration-300 group-hover:-translate-y-1 hover:shadow-xl">
        <CardContent className="p-0">
          <div className="from-muted to-muted/50 relative aspect-square overflow-hidden bg-gradient-to-br">
            {product.images?.[0] || product.image_url ? (
              <Image
                src={product.images?.[0] || product.image_url || ''}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Watch className="text-muted-foreground/30 h-12 w-12" />
              </div>
            )}
            {hasDiscount && (
              <Badge
                variant="destructive"
                className="absolute top-2 left-2 text-xs font-semibold"
              >
                {Math.round(
                  ((product.price - (product.sale_price || 0)) /
                    product.price) *
                    100
                )}
                % OFF
              </Badge>
            )}
            {/* Quick view overlay */}
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
          </div>
          <div className="p-4">
            <p className="text-muted-foreground mb-1 text-xs font-medium tracking-widest uppercase">
              {product.brand}
            </p>
            <h3 className="group-hover:text-primary line-clamp-2 min-h-[2.5rem] text-sm font-semibold transition-colors">
              {product.name}
            </h3>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-lg font-bold">
                {formatPrice(displayPrice)}
              </span>
              {hasDiscount && (
                <span className="text-muted-foreground text-xs line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// Related Products Section Component
function RelatedProductsSection({
  title,
  subtitle,
  products,
  viewAllLink,
}: {
  title: string;
  subtitle: string;
  products: Product[];
  viewAllLink?: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground mt-1">{subtitle}</p>
        </div>
        {viewAllLink && (
          <Button variant="outline" asChild className="hidden sm:flex">
            <Link href={viewAllLink}>View All</Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {viewAllLink && (
        <div className="mt-6 flex justify-center sm:hidden">
          <Button variant="outline" asChild>
            <Link href={viewAllLink}>View All</Link>
          </Button>
        </div>
      )}
    </section>
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  // Fetch related products in parallel
  const sameBrandProducts = await getSameBrandProducts(
    product.brand,
    product.id,
    4
  );

  // Get IDs of same brand products to exclude from other queries
  const sameBrandIds = sameBrandProducts.map((p) => p.id);

  // If we have less than 4 same brand products, get similar price products
  const neededSimilarPrice = Math.max(0, 4 - sameBrandProducts.length);
  const similarPriceProducts =
    neededSimilarPrice > 0
      ? await getSimilarPriceProducts(
          product.price,
          product.id,
          sameBrandIds,
          4
        )
      : [];

  // Get "You May Also Like" products (different from above)
  const allExcludedIds = [
    ...sameBrandIds,
    ...similarPriceProducts.map((p) => p.id),
  ];
  const otherProducts = await getOtherProducts(product.id, allExcludedIds, 4);

  const images =
    product.images?.length > 0
      ? product.images
      : product.image_url
        ? [product.image_url]
        : [];

  return (
    <div className="from-background to-muted/20 min-h-screen bg-gradient-to-b">
      {/* Sticky Header with Breadcrumb */}
      <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 border-b backdrop-blur">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <nav className="text-muted-foreground flex items-center gap-2 text-sm">
              <Link
                href="/"
                className="hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link
                href="/products"
                className="hover:text-foreground transition-colors"
              >
                Products
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground max-w-[200px] truncate font-medium">
                {product.name}
              </span>
            </nav>
            <Button variant="ghost" size="sm" asChild className="gap-2">
              <Link href="/products">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Products</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Gallery - Sticky on Desktop */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductGallery images={images} productName={product.name} />
          </div>

          {/* Product Info */}
          <div>
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Full Specifications Section */}
        <Separator className="my-16" />

        <div className="mx-auto max-w-4xl">
          <ProductSpecs specs={product.specs_json} />
        </div>

        {/* Related Products Sections */}
        <Separator className="my-16" />

        {/* More from Brand */}
        {sameBrandProducts.length > 0 && (
          <RelatedProductsSection
            title={`More from ${product.brand}`}
            subtitle="Explore other timepieces from this prestigious collection"
            products={sameBrandProducts}
            viewAllLink={`/products?brand=${encodeURIComponent(product.brand)}`}
          />
        )}

        {/* Similar Price Range */}
        {similarPriceProducts.length > 0 && (
          <RelatedProductsSection
            title="Similar Price Range"
            subtitle="Discover watches with comparable value"
            products={similarPriceProducts}
          />
        )}

        {/* You May Also Like */}
        {otherProducts.length > 0 && (
          <RelatedProductsSection
            title="You May Also Like"
            subtitle="Hand-picked selections for watch enthusiasts"
            products={otherProducts}
            viewAllLink="/products"
          />
        )}

        {/* Product Guarantee Section */}
        <div className="bg-muted/50 mt-8 rounded-2xl p-8 md:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <h3 className="mb-4 text-2xl font-bold">Our Promise to You</h3>
            <p className="text-muted-foreground mb-8">
              Every timepiece in our collection is carefully curated and
              authenticated. We stand behind the quality of our watches with
              comprehensive guarantees.
            </p>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div className="text-center">
                <div className="text-primary text-3xl font-bold">100%</div>
                <div className="text-muted-foreground mt-1 text-sm">
                  Authentic
                </div>
              </div>
              <div className="text-center">
                <div className="text-primary text-3xl font-bold">2 Years</div>
                <div className="text-muted-foreground mt-1 text-sm">
                  Warranty
                </div>
              </div>
              <div className="text-center">
                <div className="text-primary text-3xl font-bold">30 Days</div>
                <div className="text-muted-foreground mt-1 text-sm">
                  Returns
                </div>
              </div>
              <div className="text-center">
                <div className="text-primary text-3xl font-bold">Free</div>
                <div className="text-muted-foreground mt-1 text-sm">
                  Shipping
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} by ${product.brand} | Watch Store`,
    description:
      product.description ||
      `Discover the ${product.brand} ${product.name}. Premium timepiece with exceptional craftsmanship.`,
    openGraph: {
      title: product.name,
      description: product.description || `${product.brand} ${product.name}`,
      images:
        product.images?.[0] || product.image_url
          ? [{ url: product.images?.[0] || product.image_url || '' }]
          : [],
    },
  };
}
