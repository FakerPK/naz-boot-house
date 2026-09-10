'use client';

import Link from 'next/link';
import { ArrowRight, ChevronRight, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';

const products = [
  { id: 'heritage-runner', name: 'Heritage Runner', category: 'Everyday sneaker', price: 'PKR 8,900', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900' },
  { id: 'city-loafer', name: 'City Loafer', category: 'Polished leather', price: 'PKR 12,500', image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=900' },
  { id: 'canvas-low', name: 'Canvas Low', category: 'Easy casual', price: 'PKR 5,800', image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=900' },
];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bagCount, setBagCount] = useState(0);

  return (
    <main className="min-h-screen bg-[#f3efe7] text-[#24221f]">
      <div className="bg-[#24221f] px-5 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e9d4ae]">Free delivery across Pakistan over PKR 5,000</div>
      <header className="border-b border-[#24221f]/15 bg-[#f3efe7]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 lg:px-10">
          <button aria-label="Open menu" onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight">naz<span className="text-[#a44b35]">.</span></Link>
          <nav className="hidden items-center gap-8 text-sm font-semibold lg:flex"><Link href="/shop">Shop all</Link><Link href="/shop?category=formal">Formal</Link><Link href="/shop?category=sports">Sports</Link><Link href="/admin">Admin</Link></nav>
          <div className="flex items-center gap-4"><button aria-label="Search"><Search size={19} /></button><Link href="/cart" className="relative" aria-label="Shopping bag"><ShoppingBag size={20} />{bagCount > 0 && <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#a44b35] text-[10px] text-white">{bagCount}</span>}</Link></div>
        </div>
        {menuOpen && <nav className="flex flex-col gap-4 border-t border-[#24221f]/15 px-5 py-5 text-sm font-semibold lg:hidden"><Link href="/shop">Shop all</Link><Link href="/shop?category=formal">Formal</Link><Link href="/shop?category=sports">Sports</Link><Link href="/admin">Admin</Link></nav>}
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:py-20 lg:grid-cols-[1fr_0.88fr] lg:items-end lg:px-10 lg:py-24">
        <div><p className="eyebrow">Naz Boot House / Since 1998</p><h1 className="mt-5 max-w-3xl font-serif text-6xl leading-[.92] tracking-[-.04em] sm:text-8xl">Good shoes make the day feel easier.</h1><p className="mt-7 max-w-xl text-lg leading-8 text-[#605a51]">Reliable comfort, honest materials, and considered design for school runs, long commutes, celebrations, and everything in between.</p><div className="mt-9 flex flex-wrap gap-3"><Link href="/shop" className="inline-flex items-center gap-3 bg-[#24221f] px-6 py-4 font-semibold text-[#f3efe7] transition hover:bg-[#a44b35]">Shop the collection <ArrowRight size={17} /></Link><Link href="/shop?category=formal" className="inline-flex items-center gap-3 border border-[#24221f] px-6 py-4 font-semibold">The formal edit</Link></div></div>
        <div className="relative min-h-[390px] overflow-hidden bg-[#c7bba7]"><img src="https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=1200" alt="Brown leather shoe" className="h-full w-full object-cover mix-blend-multiply" /><div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#24221f]/80 to-transparent p-6 pt-24 text-xs font-semibold uppercase tracking-[.18em] text-[#e9d4ae]">The everyday edit / 01</div></div>
      </section>

      <section className="border-y border-[#24221f]/10 bg-[#e9d4ae]"><div className="mx-auto grid max-w-7xl gap-6 px-5 py-7 text-sm sm:grid-cols-3 lg:px-10"><div><strong>Nationwide delivery</strong><p className="mt-1 text-[#605a51]">Carefully packed to your door.</p></div><div><strong>Fit you can trust</strong><p className="mt-1 text-[#605a51]">Helpful sizing support.</p></div><div><strong>Easy exchanges</strong><p className="mt-1 text-[#605a51]">Simple when plans change.</p></div></div></section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-10"><div className="mb-9 flex items-end justify-between"><div><p className="eyebrow">Selected for you</p><h2 className="mt-3 font-serif text-5xl">The good stuff</h2></div><Link href="/shop" className="hidden items-center gap-2 font-semibold text-[#a44b35] sm:flex">View all <ChevronRight size={18} /></Link></div><div className="grid gap-5 sm:grid-cols-3">{products.map((product) => <article key={product.id} className="group"><Link href={`/product/${product.id}`} className="block overflow-hidden bg-[#ded7ca]"><img src={product.image} alt={product.name} className="aspect-[.92] w-full object-cover mix-blend-multiply transition duration-500 group-hover:scale-105" /></Link><div className="flex items-start justify-between gap-4 pt-4"><div><p className="text-xs uppercase tracking-[.12em] text-[#a44b35]">{product.category}</p><h3 className="mt-1 font-serif text-2xl">{product.name}</h3></div><p className="font-semibold">{product.price}</p></div><button onClick={() => setBagCount((count) => count + 1)} className="mt-4 w-full border border-[#24221f] py-3 text-sm font-semibold transition hover:bg-[#24221f] hover:text-[#f3efe7]">Add to bag</button></article>)}</div></section>

      <section className="bg-[#24221f] px-5 py-20 text-[#f3efe7]"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center lg:px-5"><div><p className="eyebrow text-[#e9d4ae]">A little note from us</p><h2 className="mt-4 max-w-xl font-serif text-5xl leading-tight">Made for real life, not just the shelf.</h2></div><p className="max-w-lg text-lg leading-8 text-[#bcb5aa]">We started with one shop and a simple belief: the right pair should earn its place in your routine. Every collection is chosen with comfort, durability, and local everyday life in mind.</p></div></section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-10 text-sm sm:flex-row sm:items-center sm:justify-between lg:px-10"><p className="font-serif text-xl font-bold">naz<span className="text-[#a44b35]">.</span></p><p className="text-[#605a51]">Footwear made for your everyday.</p><Link href="/admin" className="font-semibold text-[#a44b35]">Manage store</Link></footer>
    </main>
  );
}
