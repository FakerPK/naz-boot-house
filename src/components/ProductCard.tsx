'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Tag, Sparkles } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact';
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <article className={cn(
      'card group relative',
      variant === 'compact' && 'flex flex-row max-w-xs'
    )}>
      <Link href={`/product/${product.id}`} className="block relative overflow-hidden" aria-label={product.name}>
        <div className={cn(
          'relative aspect-square overflow-hidden bg-gray-50',
          variant === 'compact' && 'w-32 h-32 min-w-[128px] aspect-auto'
        )}>
          {product.images[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes={variant === 'compact' ? '128px' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'}
            />
          )}
          
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.onSale && discount > 0 && (
              <span className="px-2 py-1 bg-accent-500 text-white text-xs font-bold rounded">
                -{discount}%
              </span>
            )}
            {product.isNew && (
              <span className="px-2 py-1 bg-primary-700 text-white text-xs font-bold rounded">
                New
              </span>
            )}
            {product.featured && (
              <span className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded flex items-center gap-1">
                <Sparkles size={10} /> Featured
              </span>
            )}
          </div>

          <button
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-white transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
            aria-label="Add to wishlist"
          >
            <Heart size={18} />
          </button>
        </div>
      </Link>

      <div className={cn('p-4', variant === 'compact' && 'flex flex-col justify-between')}>
        <div>
          <p className="text-xs font-medium text-primary-600 uppercase tracking-wider mb-1">
            {product.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </p>
          <Link href={`/product/${product.id}`} className="block group">
            <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors line-clamp-1 mb-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-500">{product.brand}</p>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        {variant === 'default' && (
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {product.colors.slice(0, 4).map((color, index) => (
              <button
                key={index}
                className="w-6 h-6 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200 transition-transform hover:scale-110"
                style={{ backgroundColor: color.hex }}
                aria-label={`Color: ${color.name}`}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-gray-500">+{product.colors.length - 4} more</span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}