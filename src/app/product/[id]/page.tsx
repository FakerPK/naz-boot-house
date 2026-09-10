import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Heart, Share2, Truck, Shield, RotateCcw, Headphones, Minus, Plus, Check, ShoppingCart } from 'lucide-react';
import { getProduct, getProducts, initializeSampleData } from '@/lib/db';
import { formatPrice, cn } from '@/lib/utils';
import { SIZES } from '@/types';

export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  await initializeSampleData();
  const product = await getProduct(resolvedParams.id);
  
  if (!product) {
    return { title: 'Product Not Found - Naz Boot House' };
  }

  return {
    title: `${product.name} - Naz Boot House`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images[0],
      type: 'website',
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  await initializeSampleData();
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);
  
  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();
  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <main className="flex-1 pt-16">
      <div className="container-custom py-8">
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500" aria-label="Breadcrumb">
          <a href="/" className="hover:text-primary-700">Home</a>
          <ChevronRight size={16} />
          <a href="/shop" className="hover:text-primary-700">Shop</a>
          <ChevronRight size={16} />
          <a 
            href={`/shop?category=${product.category}`}
            className="hover:text-primary-700 capitalize"
          >
            {product.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </a>
          <ChevronRight size={16} />
          <span className="text-gray-900 truncate max-w-xs" aria-current="page">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50">
              {product.images[0] && (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              )}
              {discount > 0 && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-accent-500 text-white text-sm font-bold rounded">
                    -{discount}%
                  </span>
                </div>
              )}
              {product.isNew && (
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-primary-700 text-white text-sm font-bold rounded">New</span>
                </div>
              )}
            </div>
            
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors hover:border-primary-500"
                    aria-label={`View image ${index + 1}`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - view ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-primary-600 uppercase tracking-wider mb-2">
                {product.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-500">{product.brand}</p>
            </div>

            <div className="flex items-baseline gap-4 flex-wrap">
              <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
              )}
              {discount > 0 && (
                <span className="px-2 py-1 bg-accent-100 text-accent-700 text-sm font-bold rounded">
                  Save {formatPrice(product.originalPrice! - product.price)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Check className="text-green-500" size={16} />
                In Stock
              </span>
              <span className="flex items-center gap-1">
                <Truck className="text-primary-600" size={16} />
                Free shipping on PKR 5,000+
              </span>
            </div>

            <div className="border-t border-b border-gray-100 py-6">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {product.colors.length > 1 && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">Select Color</label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color, colorIndex) => (
                    <button
                      key={colorIndex}
                      className={cn(
                        'relative w-12 h-12 rounded-full border-3 transition-all flex items-center justify-center',
                        colorIndex === 0
                          ? 'border-primary-700 ring-2 ring-primary-700 ring-offset-2'
                          : 'border-gray-200 hover:border-primary-300'
                      )}
                      style={{ backgroundColor: color.hex }}
                      aria-label={`Select ${color.name}`}
                      aria-pressed={colorIndex === 0}
                    >
                      {color.hex === '#FFFFFF' && (
                        <div className="w-full h-full rounded-full border border-gray-300" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">Select Size</label>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Select size">
                {product.sizes.map((sizeStock) => (
                  <button
                    key={sizeStock.size}
                    className={cn(
                      'px-4 py-2.5 min-w-[52px] text-sm font-medium rounded-lg border-2 transition-all',
                      sizeStock.stock > 0
                        ? 'border-gray-200 text-gray-700 hover:border-primary-500 hover:text-primary-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
                        : 'border-gray-200 text-gray-400 cursor-not-allowed line-through'
                    )}
                    disabled={sizeStock.stock === 0}
                    aria-label={`Size ${sizeStock.size} ${sizeStock.stock === 0 ? 'out of stock' : `${sizeStock.stock} in stock`}`}
                  >
                    {sizeStock.size}
                    {sizeStock.stock > 0 && sizeStock.stock <= 3 && (
                      <span className="ml-1 text-xs text-accent-600">({sizeStock.stock} left)</span>
                    )}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                <a href="/size-guide" className="text-primary-700 hover:underline">Size guide</a>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button className="p-3 text-gray-600 hover:bg-gray-100" aria-label="Decrease quantity">
                  <Minus size={20} />
                </button>
                <input
                  type="number"
                  value="1"
                  min="1"
                  max={Math.max(...product.sizes.filter(s => s.stock > 0).map(s => s.stock), 1)}
                  className="w-16 text-center border-x border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Quantity"
                />
                <button className="p-3 text-gray-600 hover:bg-gray-100" aria-label="Increase quantity">
                  <Plus size={20} />
                </button>
              </div>
              <button className="btn-primary flex-1 flex items-center justify-center gap-2">
                <ShoppingCart size={20} />
                Add to Cart
              </button>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
              <button className="p-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-primary-700 transition-colors" aria-label="Add to wishlist">
                <Heart size={20} />
              </button>
              <button className="p-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-primary-700 transition-colors" aria-label="Share product">
                <Share2 size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Truck className="text-primary-600" size={24} />
                <div>
                  <p className="font-medium text-gray-900">Free Shipping</p>
                  <p className="text-sm text-gray-500">On orders over PKR 5,000</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <RotateCcw className="text-primary-600" size={24} />
                <div>
                  <p className="font-medium text-gray-900">Easy Returns</p>
                  <p className="text-sm text-gray-500">30-day return policy</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Shield className="text-primary-600" size={24} />
                <div>
                  <p className="font-medium text-gray-900">Secure Payment</p>
                  <p className="text-sm text-gray-500">100% secure checkout</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Headphones className="text-primary-600" size={24} />
                <div>
                  <p className="font-medium text-gray-900">24/7 Support</p>
                  <p className="text-sm text-gray-500">We're here to help</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <article key={relatedProduct.id} className="card group">
                  <a href={`/product/${relatedProduct.id}`} className="block relative aspect-square overflow-hidden bg-gray-50">
                    {relatedProduct.images[0] && (
                      <Image
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    )}
                  </a>
                  <div className="p-4">
                    <p className="text-xs font-medium text-primary-600 uppercase tracking-wider mb-1">
                      {relatedProduct.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </p>
                    <a href={`/product/${relatedProduct.id}`} className="block group">
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors line-clamp-1 mb-1">
                        {relatedProduct.name}
                      </h3>
                    </a>
                    <p className="text-sm text-gray-500">{relatedProduct.brand}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="font-bold text-gray-900">{formatPrice(relatedProduct.price)}</span>
                      {relatedProduct.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">{formatPrice(relatedProduct.originalPrice)}</span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}