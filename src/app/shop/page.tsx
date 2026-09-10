import { Metadata } from 'next';
import { getProducts, getProductsByCategory, searchProducts, initializeSampleData } from '@/lib/db';
import { ProductCard } from '@/components/ProductCard';
import { CATEGORIES, SIZES } from '@/types';
import { ChevronDown, Filter, X, SlidersHorizontal } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shop All Products - Naz Boot House',
  description: 'Browse our complete collection of shoes, slippers, school shoes, and sports footwear. Filter by category, size, price, and more.',
};

export const dynamic = 'force-dynamic';

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    featured?: string;
    sale?: string;
    new?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    sizes?: string;
    colors?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  await initializeSampleData();
  
  const params = await searchParams;
  const { category, q, featured, sale, new: isNew, sort, minPrice, maxPrice, sizes, colors } = params;

  let products = await getProducts();

  if (category) {
    products = products.filter(p => p.category === category);
  }
  if (q) {
    products = await searchProducts(q);
  }
  if (featured === 'true') {
    products = products.filter(p => p.featured);
  }
  if (sale === 'true') {
    products = products.filter(p => p.onSale);
  }
  if (isNew === 'true') {
    products = products.filter(p => p.isNew);
  }
  if (minPrice) {
    products = products.filter(p => p.price >= parseInt(minPrice));
  }
  if (maxPrice) {
    products = products.filter(p => p.price <= parseInt(maxPrice));
  }
  if (sizes) {
    const sizeList = sizes.split(',');
    products = products.filter(p => p.sizes.some(s => sizeList.includes(s.size) && s.stock > 0));
  }

  switch (sort) {
    case 'price-asc':
      products.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      products.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'name-asc':
      products.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  const activeFilters: string[] = [
    category && `Category: ${CATEGORIES.find(c => c.slug === category)?.name}`,
    q && `Search: "${q}"`,
    featured === 'true' && 'Featured',
    sale === 'true' && 'On Sale',
    isNew === 'true' && 'New Arrivals',
    minPrice && `Min: PKR ${minPrice}`,
    maxPrice && `Max: PKR ${maxPrice}`,
    sizes && `Sizes: ${sizes.split(',').join(', ')}`,
  ].filter((f): f is string => Boolean(f));

  return (
    <main className="flex-1 pt-16">
      <div className="bg-gray-50 py-8">
        <div className="container-custom">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            {category 
              ? CATEGORIES.find(c => c.slug === category)?.name 
              : q 
                ? `Search Results for "${q}"` 
                : featured === 'true' 
                  ? 'Featured Products' 
                  : sale === 'true' 
                    ? 'Sale' 
                    : isNew === 'true' 
                      ? 'New Arrivals' 
                      : 'All Products'}
          </h1>
          <p className="text-gray-500 mt-1">{products.length} products found</p>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Categories</h3>
                  <button className="lg:hidden text-sm text-primary-700 font-medium" id="filter-toggle">
                    <Filter size={16} className="inline mr-1" /> Filters
                  </button>
                </div>
                <nav className="space-y-2" aria-label="Category filters">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={!category}
                      onChange={() => window.location.href = '/shop'}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="text-gray-700 hover:text-primary-700 transition-colors">All Products</span>
                  </label>
                  {CATEGORIES.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={cat.slug}
                        checked={category === cat.slug}
                        onChange={() => {
                          const url = new URL(window.location.href);
                          url.searchParams.set('category', cat.slug);
                          url.searchParams.delete('q');
                          url.searchParams.delete('featured');
                          url.searchParams.delete('sale');
                          url.searchParams.delete('new');
                          window.location.href = url.toString();
                        }}
                        className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span className="text-gray-700 hover:text-primary-700 transition-colors">{cat.name}</span>
                      <span className="text-gray-400 text-sm ml-auto">({cat.productCount})</span>
                    </label>
                  ))}
                </nav>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice || ''}
                      onChange={(e) => {
                        const url = new URL(window.location.href);
                        if (e.target.value) url.searchParams.set('minPrice', e.target.value);
                        else url.searchParams.delete('minPrice');
                        window.location.href = url.toString();
                      }}
                      className="input-field text-sm w-1/2"
                      min="0"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice || ''}
                      onChange={(e) => {
                        const url = new URL(window.location.href);
                        if (e.target.value) url.searchParams.set('maxPrice', e.target.value);
                        else url.searchParams.delete('maxPrice');
                        window.location.href = url.toString();
                      }}
                      className="input-field text-sm w-1/2"
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: 'Under PKR 3,000', min: '', max: '3000' },
                      { label: 'PKR 3,000 - 7,000', min: '3000', max: '7000' },
                      { label: 'PKR 7,000 - 15,000', min: '7000', max: '15000' },
                      { label: 'Above PKR 15,000', min: '15000', max: '' },
                    ].map(({ label, min, max }) => (
                      <label key={label} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="priceRange"
                          checked={minPrice === min && maxPrice === max}
                          onChange={() => {
                            const url = new URL(window.location.href);
                            if (min) url.searchParams.set('minPrice', min);
                            else url.searchParams.delete('minPrice');
                            if (max) url.searchParams.set('maxPrice', max);
                            else url.searchParams.delete('maxPrice');
                            window.location.href = url.toString();
                          }}
                          className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                        />
                        <span className="text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Sizes</h3>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((size) => (
                    <label key={size} className="cursor-pointer">
                      <input
                        type="checkbox"
                        value={size}
                        checked={sizes?.split(',').includes(size)}
                        onChange={(e) => {
                          const url = new URL(window.location.href);
                          const currentSizes = sizes?.split(',').filter(Boolean) || [];
                          if (e.target.checked) {
                            currentSizes.push(size);
                          } else {
                            const index = currentSizes.indexOf(size);
                            if (index > -1) currentSizes.splice(index, 1);
                          }
                          if (currentSizes.length) url.searchParams.set('sizes', currentSizes.join(','));
                          else url.searchParams.delete('sizes');
                          window.location.href = url.toString();
                        }}
                        className="sr-only peer"
                      />
                      <span className={`
                        px-3 py-1.5 text-sm font-medium rounded-lg border-2 transition-all
                        ${sizes?.split(',').includes(size)
                          ? 'bg-primary-700 text-white border-primary-700'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300'
                        }
                      `}>
                        {size}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Features</h3>
                <div className="space-y-2">
                  {[
                    { key: 'featured', label: 'Featured' },
                    { key: 'sale', label: 'On Sale' },
                    { key: 'new', label: 'New Arrivals' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={params[key as keyof typeof params] === 'true'}
                        onChange={(e) => {
                          const url = new URL(window.location.href);
                          if (e.target.checked) url.searchParams.set(key, 'true');
                          else url.searchParams.delete(key);
                          window.location.href = url.toString();
                        }}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            {activeFilters.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                <span className="text-sm text-gray-500">Active filters:</span>
                {activeFilters.map((filter, index) => (
                  <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">
                    {filter}
                    <button
                      onClick={() => {
                        const url = new URL(window.location.href);
                        if (filter.startsWith('Category:')) url.searchParams.delete('category');
                        else if (filter.startsWith('Search:')) url.searchParams.delete('q');
                        else if (filter === 'Featured') url.searchParams.delete('featured');
                        else if (filter === 'On Sale') url.searchParams.delete('sale');
                        else if (filter === 'New Arrivals') url.searchParams.delete('new');
                        else if (filter.startsWith('Min:')) url.searchParams.delete('minPrice');
                        else if (filter.startsWith('Max:')) url.searchParams.delete('maxPrice');
                        else if (filter.startsWith('Sizes:')) url.searchParams.delete('sizes');
                        window.location.href = url.toString();
                      }}
                      className="hover:text-primary-900"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                <button
                  onClick={() => window.location.href = '/shop'}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  Sort by:
                  <select
                    value={sort || 'featured'}
                    onChange={(e) => {
                      const url = new URL(window.location.href);
                      if (e.target.value !== 'featured') url.searchParams.set('sort', e.target.value);
                      else url.searchParams.delete('sort');
                      window.location.href = url.toString();
                    }}
                    className="input-field text-sm w-auto py-1.5"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                  </select>
                </label>
              </div>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <SlidersHorizontal className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={() => window.location.href = '/shop'}
                  className="btn-primary"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}