import { Metadata } from 'next';
import { getProducts, initializeSampleData } from '@/lib/db';
import { ProductCard } from '@/components/ProductCard';
import { CATEGORIES } from '@/types';

export const metadata: Metadata = {
  title: 'Naz Boot House - Premium Footwear for Every Occasion',
  description: 'Discover premium shoes, slippers, school shoes, and sports footwear at Naz Boot House. Quality craftsmanship, comfortable fit, and timeless style.',
};

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  await initializeSampleData();
  
  const [featuredProducts, newProducts, saleProducts] = await Promise.all([
    getProducts().then(p => p.filter(prod => prod.featured).slice(0, 8)),
    getProducts().then(p => p.filter(prod => prod.isNew).slice(0, 8)),
    getProducts().then(p => p.filter(prod => prod.onSale).slice(0, 8)),
  ]);

  return (
    <main className="flex-1 pt-16">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        <div className="container-custom relative py-20 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Step Into{' '}
              <span className="text-accent-400">Comfort & Style</span>
            </h1>
            <p className="text-lg sm:text-xl text-primary-100 mb-8 max-w-2xl leading-relaxed">
              Discover premium footwear crafted for every occasion. From formal shoes to casual sneakers, 
              find your perfect fit at Naz Boot House.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/shop"
                className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
              >
                Shop Now
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
              <a
                href="/shop?category=shoes"
                className="btn-outline border-white text-white hover:bg-white hover:text-primary-900 w-full sm:w-auto"
              >
                Explore Collection
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: 'Truck', title: 'Free Shipping', desc: 'On orders over PKR 5,000' },
              { icon: 'Shield', title: 'Secure Payment', desc: '100% secure checkout' },
              { icon: 'RotateCcw', title: 'Easy Returns', desc: '30-day return policy' },
              { icon: 'Headphones', title: '24/7 Support', desc: 'We\'re here to help' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="text-center p-6">
                <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center mx-auto mb-4 text-primary-700">
                  {icon === 'Truck' && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>}
                  {icon === 'Shield' && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                  {icon === 'RotateCcw' && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>}
                  {icon === 'Headphones' && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Shop by Category</h2>
              <p className="text-gray-500 mt-1">Explore our curated collections</p>
            </div>
            <a
              href="/shop"
              className="text-primary-700 font-medium hover:text-primary-800 flex items-center gap-1"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((category) => (
              <a
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="group relative aspect-square rounded-xl overflow-hidden"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                  <p className="text-primary-100 text-sm">{category.productCount} products</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Products</h2>
                <p className="text-gray-500 mt-1">Our handpicked favorites</p>
              </div>
              <a
                href="/shop?featured=true"
                className="text-primary-700 font-medium hover:text-primary-800 flex items-center gap-1"
              >
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {newProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">New Arrivals</h2>
                <p className="text-gray-500 mt-1">Fresh styles just landed</p>
              </div>
              <a
                href="/shop?new=true"
                className="text-primary-700 font-medium hover:text-primary-800 flex items-center gap-1"
              >
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {saleProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Sale</h2>
                <p className="text-gray-500 mt-1">Great deals on selected styles</p>
              </div>
              <a
                href="/shop?sale=true"
                className="text-primary-700 font-medium hover:text-primary-800 flex items-center gap-1"
              >
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {saleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-primary-900 text-white">
        <div className="container-custom text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Ready to Find Your Perfect Pair?</h2>
          <p className="text-primary-200 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers. Shop with confidence at Naz Boot House.
          </p>
          <a
            href="/shop"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-500 text-white font-medium rounded-lg hover:bg-accent-600 transition-colors"
          >
            Start Shopping
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
        </div>
      </section>
    </main>
  );
}