import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, Box, ChevronRight, Clock3, Truck } from 'lucide-react';
import { getProducts, initializeSampleData } from '@/lib/db';
import { ProductCard } from '@/components/ProductCard';
import { CATEGORIES } from '@/types';

export const metadata: Metadata = {
  title: 'Naz Boot House | Footwear made for your everyday',
  description: 'Shop dependable shoes, slippers and school footwear from Naz Boot House.',
};

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  await initializeSampleData();
  const products = await getProducts();
  const featured = products.filter((product) => product.featured).slice(0, 4);
  const arrivals = products.filter((product) => product.isNew).slice(0, 4);

  return (
    <main className="bg-stone-50 text-stone-950">
      <section className="bg-ink text-stone-50">
        <div className="container-custom flex min-h-[560px] flex-col justify-between py-8 lg:min-h-[650px]">
          <div className="flex items-center justify-between border-b border-stone-700 pb-6 text-sm text-stone-300">
            <span>Free delivery across Pakistan over PKR 5,000</span>
            <Link href="/shop" className="hidden items-center gap-2 font-semibold text-sand hover:text-white sm:flex">Explore the collection <ArrowRight size={16} /></Link>
          </div>
          <div className="grid gap-12 py-16 lg:grid-cols-[1fr_0.9fr] lg:items-end lg:py-20">
            <div>
              <p className="mb-5 font-mono text-xs uppercase tracking-[0.28em] text-sand">Naz Boot House / Since 1998</p>
              <h1 className="max-w-3xl text-balance font-serif text-5xl leading-[0.95] sm:text-7xl lg:text-8xl">Good shoes make the day feel easier.</h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-stone-300">Reliable comfort, honest materials, and considered design for school runs, long commutes, celebrations, and everything in between.</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/shop" className="inline-flex items-center gap-3 bg-sand px-6 py-4 font-semibold text-ink transition hover:bg-white">Shop all footwear <ArrowRight size={18} /></Link>
                <Link href="/shop?category=formal" className="inline-flex items-center gap-3 border border-stone-600 px-6 py-4 font-semibold text-white transition hover:border-sand hover:text-sand">See formal edit</Link>
              </div>
            </div>
            <div className="relative min-h-[300px] overflow-hidden bg-stone-800 sm:min-h-[390px]">
              <img src="https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=1100" alt="Brown leather dress shoes" className="h-full w-full object-cover opacity-90 mix-blend-screen" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/80 to-transparent p-6 pt-24"><span className="font-mono text-xs uppercase tracking-[0.2em] text-sand">The everyday edit / 01</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-stone-200 bg-sand">
        <div className="container-custom grid gap-5 py-7 sm:grid-cols-3">
          {[
            { icon: Truck, title: 'Nationwide delivery', copy: 'Carefully packed and sent to your door.' },
            { icon: BadgeCheck, title: 'Fit you can trust', copy: 'Thoughtful sizing and helpful support.' },
            { icon: Box, title: 'Easy exchanges', copy: 'A simple process when plans change.' },
          ].map(({ icon: Icon, title, copy }) => <div className="flex items-start gap-4" key={title}><Icon className="mt-1 text-rust" size={21} /><div><h2 className="font-semibold">{title}</h2><p className="mt-1 text-sm text-stone-600">{copy}</p></div></div>)}
        </div>
      </section>

      <section className="container-custom py-20">
        <div className="mb-9 flex items-end justify-between gap-6"><div><p className="eyebrow">Find your pair</p><h2 className="mt-3 font-serif text-4xl sm:text-5xl">Shop by purpose</h2></div><Link href="/shop" className="hidden items-center gap-2 font-semibold text-rust sm:flex">View all <ChevronRight size={18} /></Link></div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((category) => <Link href={`/shop?category=${category.slug}`} key={category.id} className="group relative aspect-[0.85] overflow-hidden bg-stone-200"><img src={category.image} alt={category.name} className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0" /><div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" /><div className="absolute bottom-0 p-4 text-white"><h3 className="font-serif text-xl">{category.name}</h3><p className="mt-1 text-xs text-stone-300">{category.description}</p></div></Link>)}
        </div>
      </section>

      {featured.length > 0 && <section className="border-y border-stone-200 bg-white py-20"><div className="container-custom"><div className="mb-9 flex items-end justify-between"><div><p className="eyebrow">Selected for you</p><h2 className="mt-3 font-serif text-4xl sm:text-5xl">The good stuff</h2></div><Link href="/shop?featured=true" className="flex items-center gap-2 font-semibold text-rust">See edit <ChevronRight size={18} /></Link></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{featured.map((product) => <ProductCard key={product.id} product={product} />)}</div></div></section>}

      <section className="container-custom grid gap-10 py-20 lg:grid-cols-[0.75fr_1fr] lg:items-center"><div><p className="eyebrow">A little note from us</p><h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">Made for real life, not just the shelf.</h2><p className="mt-6 max-w-lg leading-7 text-stone-600">We started with one shop and a simple belief: the right pair should earn its place in your routine. Every collection is chosen with comfort, durability, and local everyday life in mind.</p><Link href="/shop" className="mt-8 inline-flex items-center gap-2 font-semibold text-rust">Meet the collection <ArrowRight size={18} /></Link></div><div className="grid grid-cols-2 gap-3"><img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800" alt="Red athletic shoe" className="mt-10 aspect-[0.8] w-full object-cover" /><img src="https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800" alt="Casual canvas shoe" className="aspect-[0.8] w-full object-cover" /></div></section>

      {arrivals.length > 0 && <section className="bg-ink py-20 text-white"><div className="container-custom"><div className="mb-9 flex items-end justify-between"><div><p className="eyebrow text-sand">Just landed</p><h2 className="mt-3 font-serif text-4xl sm:text-5xl">New arrivals</h2></div><Link href="/shop?new=true" className="flex items-center gap-2 font-semibold text-sand">Shop new <ChevronRight size={18} /></Link></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{arrivals.map((product) => <ProductCard key={product.id} product={product} />)}</div></div></section>}
    </main>
  );
}
