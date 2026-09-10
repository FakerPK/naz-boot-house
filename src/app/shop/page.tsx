import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, ShieldCheck, ShoppingBag } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import type { Product } from '@/types';

export const metadata: Metadata = {
  title: 'Shop | Naz Boot House',
  description: 'Shop dependable footwear selected by Naz Boot House.',
};

const catalog: Product[] = [
  { id: 'classic-leather-loafer', name: 'Classic Leather Loafer', description: 'Polished leather comfort for workdays and weekends.', price: 6500, originalPrice: 7500, images: ['https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=900'], category: 'formal', brand: 'Naz Boot House', sizes: [{ size: '39', stock: 4 }, { size: '40', stock: 8 }, { size: '41', stock: 6 }, { size: '42', stock: 3 }], colors: [{ name: 'Black', hex: '#171717', images: [] }], featured: true, isNew: false, onSale: true, tags: ['leather', 'formal'], createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: 'everyday-runner', name: 'Everyday Runner', description: 'Lightweight cushioning for commutes, errands, and daily miles.', price: 7200, images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900'], category: 'sports', brand: 'Naz Boot House', sizes: [{ size: '39', stock: 5 }, { size: '40', stock: 5 }, { size: '41', stock: 7 }, { size: '42', stock: 4 }, { size: '43', stock: 2 }], colors: [{ name: 'Red', hex: '#c2412d', images: [] }], featured: true, isNew: true, onSale: false, tags: ['running', 'daily'], createdAt: '2026-02-01', updatedAt: '2026-02-01' },
  { id: 'heritage-school-shoe', name: 'Heritage School Shoe', description: 'Hardwearing school shoes built for every school day.', price: 4200, images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=900'], category: 'school-shoes', brand: 'Naz Boot House', sizes: [{ size: '36', stock: 5 }, { size: '37', stock: 8 }, { size: '38', stock: 4 }, { size: '39', stock: 5 }], colors: [{ name: 'Brown', hex: '#5b3928', images: [] }], featured: false, isNew: false, onSale: false, tags: ['school'], createdAt: '2026-01-12', updatedAt: '2026-01-12' },
  { id: 'soft-home-slide', name: 'Soft Home Slide', description: 'Easy slip-on comfort with a supportive everyday sole.', price: 1800, images: ['https://images.unsplash.com/photo-1584735174923-1e5b1b4d0d4b?w=900'], category: 'slippers', brand: 'Naz Boot House', sizes: [{ size: '39', stock: 10 }, { size: '40', stock: 10 }, { size: '41', stock: 8 }, { size: '42', stock: 6 }], colors: [{ name: 'Tan', hex: '#b88b5a', images: [] }], featured: false, isNew: true, onSale: false, tags: ['comfort'], createdAt: '2026-02-12', updatedAt: '2026-02-12' },
];

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-background pb-20 pt-20 text-foreground">
      <section className="border-b border-border bg-secondary/60">
        <div className="container-custom flex flex-col gap-6 py-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-accent">The current collection</p>
            <h1 className="font-serif text-4xl leading-tight sm:text-6xl">Built for the way you move.</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">A considered edit of dependable shoes, slippers, and school essentials. Simple choices, honest materials, and comfort that lasts.</p>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold hover:text-accent">Back home <ArrowRight size={16} /></Link>
        </div>
      </section>

      <section className="container-custom py-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div><p className="text-sm text-muted-foreground">{catalog.length} essentials</p><h2 className="font-serif text-3xl">Shop all</h2></div>
          <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex"><ShieldCheck size={17} className="text-accent" /> Quality checked</div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {catalog.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="container-custom grid gap-4 sm:grid-cols-3">
        {['Cash on delivery available', 'Easy size exchange', 'Packed with care'].map((item) => <div key={item} className="flex items-center gap-3 border border-border bg-card p-4 text-sm font-medium"><Check size={17} className="text-accent" /> {item}</div>)}
      </section>

      <Link href="/shop" className="fixed bottom-5 right-5 inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg"><ShoppingBag size={17} /> Browse collection</Link>
    </main>
  );
}
