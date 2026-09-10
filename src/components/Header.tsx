'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, X, Search, User, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CATEGORIES } from '@/types';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem('naz-boot-house-cart');
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);
        setCartCount(cart.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0));
      } catch {
        setCartCount(0);
      }
    }
    window.addEventListener('storage', () => {
      const savedCart = localStorage.getItem('naz-boot-house-cart');
      if (savedCart) {
        try {
          const cart = JSON.parse(savedCart);
          setCartCount(cart.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0));
        } catch {
          setCartCount(0);
        }
      }
    });
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100'
          : 'bg-transparent'
      )}
    >
      <nav className="container-custom" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="Naz Boot House Home">
            <div className="w-10 h-10 rounded-lg bg-primary-700 flex items-center justify-center">
              <span className="text-white font-bold text-lg">NBH</span>
            </div>
            <span className="font-semibold text-xl text-gray-900 hidden sm:block">Naz Boot House</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="text-sm font-medium text-gray-700 hover:text-primary-700 transition-colors"
              >
                {category.name}
              </Link>
            ))}
            <Link
              href="/shop"
              className="text-sm font-medium text-gray-700 hover:text-primary-700 transition-colors"
            >
              All Products
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-600 hover:text-primary-700 transition-colors md:hidden"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <Link
              href="/wishlist"
              className="p-2 text-gray-600 hover:text-primary-700 transition-colors hidden sm:flex"
              aria-label="Wishlist"
            >
              <Heart size={20} />
            </Link>

            <Link
              href="/account"
              className="p-2 text-gray-600 hover:text-primary-700 transition-colors hidden sm:flex"
              aria-label="Account"
            >
              <User size={20} />
            </Link>

            <Link
              href="/cart"
              className="relative p-2 text-gray-600 hover:text-primary-700 transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-primary-700 transition-colors md:hidden"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isSearchOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-slide-down">
            <form action="/shop" className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="search"
                name="q"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                autoFocus
              />
            </form>
          </div>
        )}

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-slide-down">
            <div className="flex flex-col gap-2">
              {CATEGORIES.map((category) => (
                <Link
                  key={category.id}
                  href={`/shop?category=${category.slug}`}
                  className="px-4 py-3 text-base font-medium text-gray-700 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              <Link
                href="/shop"
                className="px-4 py-3 text-base font-medium text-gray-700 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                All Products
              </Link>
              <hr className="my-2 border-gray-100" />
              <Link
                href="/cart"
                className="px-4 py-3 text-base font-medium text-gray-700 hover:text-primary-700 transition-colors flex items-center gap-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ShoppingCart size={20} />
                Cart ({cartCount})
              </Link>
              <Link
                href="/wishlist"
                className="px-4 py-3 text-base font-medium text-gray-700 hover:text-primary-700 transition-colors flex items-center gap-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Heart size={20} />
                Wishlist
              </Link>
              <Link
                href="/account"
                className="px-4 py-3 text-base font-medium text-gray-700 hover:text-primary-700 transition-colors flex items-center gap-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User size={20} />
                My Account
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}