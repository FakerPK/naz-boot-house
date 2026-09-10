'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowLeft, Gift, Shield, RotateCcw } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { CartItem } from '@/types';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedCart = localStorage.getItem('naz-boot-house-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch {
        setCartItems([]);
      }
    }
    setIsLoading(false);
  }, []);

  const updateQuantity = (productId: string, size: string, color: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId, size, color);
      return;
    }
    setCartItems(prev => prev.map(item => 
      item.productId === productId && item.size === size && item.color === color
        ? { ...item, quantity }
        : item
    ));
  };

  const removeItem = (productId: string, size: string, color: string) => {
    setCartItems(prev => prev.filter(item => 
      !(item.productId === productId && item.size === size && item.color === color)
    ));
  };

  const saveCart = (items: CartItem[]) => {
    localStorage.setItem('naz-boot-house-cart', JSON.stringify(items));
    window.dispatchEvent(new Event('storage'));
  };

  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 5000 ? 0 : 500;
  const tax = Math.round(subtotal * 0.17);
  const total = subtotal + shipping + tax;

  if (isLoading) {
    return (
      <main className="flex-1 pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="flex-1 pt-16">
      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <svg className="mx-auto text-gray-300 mb-4" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added any products yet.</p>
            <Link href="/shop" className="btn-primary inline-flex">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Size / Color</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {cartItems.map((item, index) => (
                        <tr key={`${item.productId}-${item.size}-${item.color}-${index}`} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                  sizes="80px"
                                />
                              </div>
                              <div>
                                <Link href={`/product/${item.productId}`} className="font-medium text-gray-900 hover:text-primary-700">
                                  {item.name}
                                </Link>
                                <p className="text-sm text-gray-500">{item.brand || 'Naz Boot House'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 hidden md:table-cell">
                            <div className="space-y-1">
                              <span className="text-sm text-gray-700">Size: {item.size}</span>
                              <span className="text-sm text-gray-500">Color: {item.color}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right font-medium text-gray-900">
                            {formatPrice(item.price)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                                className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:border-gray-400 transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="font-medium text-gray-900 w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                                className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:border-gray-400 transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right font-semibold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => removeItem(item.productId, item.size, item.color)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 size={20} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    href="/shop"
                    className="text-primary-700 font-medium hover:text-primary-800 flex items-center gap-2"
                  >
                    <ArrowLeft size={20} />
                    Continue Shopping
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to clear your cart?')) {
                        setCartItems([]);
                      }
                    }}
                    className="text-gray-500 hover:text-gray-700 font-medium"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-medium text-gray-900">
                      {shipping === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-sm text-primary-600 text-center">
                      Add {formatPrice(5000 - subtotal)} more for free shipping!
                    </p>
                  )}
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (17%)</span>
                    <span className="font-medium text-gray-900">{formatPrice(tax)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-primary-700">{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Gift className="text-primary-600" size={20} />
                    <span>Promo code can be applied at checkout</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="btn-primary w-full flex items-center justify-center gap-2 py-4"
                >
                  Proceed to Checkout
                  <span>({cartItems.length} items)</span>
                </Link>

                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <Shield className="text-green-600 mx-auto mb-1" size={20} />
                    <p className="text-xs text-green-800 font-medium">Secure Checkout</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <RotateCcw className="text-blue-600 mx-auto mb-1" size={20} />
                    <p className="text-xs text-blue-800 font-medium">Easy Returns</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <Gift className="text-purple-600 mx-auto mb-1" size={20} />
                    <p className="text-xs text-purple-800 font-medium">Quality Guaranteed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}