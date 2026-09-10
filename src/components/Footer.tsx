import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Truck, Shield, RotateCcw, Headphones } from 'lucide-react';
import { CATEGORIES } from '@/types';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6" aria-label="Naz Boot House Home">
              <div className="w-12 h-12 rounded-lg bg-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">NBH</span>
              </div>
              <span className="font-semibold text-xl text-white">Naz Boot House</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-xs">
              Premium footwear for every occasion. Quality craftsmanship, comfortable fit, and timeless style since 2020.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors" aria-label="YouTube">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              {CATEGORIES.map((category) => (
                <li key={category.id}>
                  <Link href={`/shop?category=${category.slug}`} className="hover:text-white transition-colors">
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">All Products</Link>
              </li>
              <li>
                <Link href="/shop?featured=true" className="hover:text-white transition-colors">Featured</Link>
              </li>
              <li>
                <Link href="/shop?sale=true" className="hover:text-white transition-colors">Sale</Link>
              </li>
              <li>
                <Link href="/shop?new=true" className="hover:text-white transition-colors">New Arrivals</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/size-guide" className="hover:text-white transition-colors">Size Guide</Link></li>
              <li><Link href="/track-order" className="hover:text-white transition-colors">Track Order</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">About Us</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link href="/stores" className="hover:text-white transition-colors">Store Locator</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/press" className="hover:text-white transition-colors">Press</Link></li>
              <li><Link href="/sustainability" className="hover:text-white transition-colors">Sustainability</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">Subscribe for exclusive offers and new arrivals.</p>
            <form className="flex flex-col gap-2" action="/api/newsletter" method="POST">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white placeholder-gray-500"
                required
              />
              <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-4">By subscribing, you agree to our <a href="/privacy" className="underline hover:text-white">Privacy Policy</a>.</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary-600/20 flex items-center justify-center text-primary-400">
                <Truck size={24} />
              </div>
              <div>
                <p className="text-white font-medium">Free Shipping</p>
                <p className="text-xs text-gray-400">On orders over PKR 5,000</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary-600/20 flex items-center justify-center text-primary-400">
                <Shield size={24} />
              </div>
              <div>
                <p className="text-white font-medium">Secure Payment</p>
                <p className="text-xs text-gray-400">100% secure checkout</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary-600/20 flex items-center justify-center text-primary-400">
                <RotateCcw size={24} />
              </div>
              <div>
                <p className="text-white font-medium">Easy Returns</p>
                <p className="text-xs text-gray-400">30-day return policy</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary-600/20 flex items-center justify-center text-primary-400">
                <Headphones size={24} />
              </div>
              <div>
                <p className="text-white font-medium">24/7 Support</p>
                <p className="text-xs text-gray-400">We're here to help</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Naz Boot House. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}