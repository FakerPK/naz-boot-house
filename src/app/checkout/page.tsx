'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Truck, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { CartItem, CustomerInfo, ShippingInfo } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    customer: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    } as CustomerInfo,
    shipping: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Pakistan',
    } as ShippingInfo,
    payment: {
      method: 'cod' as 'cod' | 'card' | 'bank-transfer',
    },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('naz-boot-house-cart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        if (items.length === 0) {
          router.push('/cart');
        }
        setCartItems(items);
      } catch {
        router.push('/cart');
      }
    } else {
      router.push('/cart');
    }
    setIsLoading(false);
  }, [router]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 5000 ? 0 : 500;
  const tax = Math.round(subtotal * 0.17);
  const total = subtotal + shipping + tax;

  const validateStep = (stepNum: number) => {
    const newErrors: Record<string, string> = {};
    
    if (stepNum === 1) {
      if (!formData.customer.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.customer.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.customer.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer.email)) newErrors.email = 'Invalid email format';
      if (!formData.customer.phone.trim()) newErrors.phone = 'Phone number is required';
    }
    
    if (stepNum === 2) {
      if (!formData.shipping.address.trim()) newErrors.address = 'Address is required';
      if (!formData.shipping.city.trim()) newErrors.city = 'City is required';
      if (!formData.shipping.state.trim()) newErrors.state = 'State/Province is required';
      if (!formData.shipping.zipCode.trim()) newErrors.zipCode = 'ZIP/Postal code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(1) || !validateStep(2)) return;
    
    setIsSubmitting(true);
    
    try {
      const orderData = {
        id: `ORD-${Date.now()}`,
        items: cartItems,
        customer: formData.customer,
        shipping: formData.shipping,
        payment: formData.payment,
        status: 'pending' as const,
        subtotal,
        shippingCost: shipping,
        tax,
        total,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        localStorage.removeItem('naz-boot-house-cart');
        window.dispatchEvent(new Event('storage'));
        router.push(`/order-success?orderId=${orderData.id}`);
      } else {
        throw new Error('Failed to place order');
      }
    } catch (error) {
      console.error('Order error:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <div className="flex items-center gap-4 mt-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-medium
                  ${step >= s ? 'bg-primary-700 text-white' : 'bg-gray-200 text-gray-500'}
                `}>
                  {step > s ? <CheckCircle size={20} /> : s}
                </div>
                {s < 3 && (
                  <div className={`
                    w-16 h-1 mx-2
                    ${step > s ? 'bg-primary-700' : 'bg-gray-200'}
                  `} />
                )}
                <span className={`
                  text-sm font-medium hidden sm:block
                  ${step >= s ? 'text-primary-700' : 'text-gray-500'}
                `}>
                  {['Contact', 'Shipping', 'Payment'][s - 1]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  {step === 1 && 'Contact Information'}
                  {step === 2 && 'Shipping Address'}
                  {step === 3 && 'Payment Method'}
                </h2>

                {step === 1 && (
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          value={formData.customer.firstName}
                          onChange={(e) => setFormData(prev => ({ ...prev, customer: { ...prev.customer, firstName: e.target.value } }))}
                          className={`input-field ${errors.firstName ? 'border-red-500 focus:ring-red-500' : ''}`}
                        />
                        {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          value={formData.customer.lastName}
                          onChange={(e) => setFormData(prev => ({ ...prev, customer: { ...prev.customer, lastName: e.target.value } }))}
                          className={`input-field ${errors.lastName ? 'border-red-500 focus:ring-red-500' : ''}`}
                        />
                        {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.customer.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, customer: { ...prev.customer, email: e.target.value } }))}
                        className={`input-field ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.customer.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, customer: { ...prev.customer, phone: e.target.value } }))}
                        className={`input-field ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="+92 XXX XXXXXXX"
                      />
                      {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <textarea
                        id="address"
                        rows={2}
                        value={formData.shipping.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, shipping: { ...prev.shipping, address: e.target.value } }))}
                        className={`input-field ${errors.address ? 'border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="House/Building, Street, Area"
                      />
                      {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          id="city"
                          value={formData.shipping.city}
                          onChange={(e) => setFormData(prev => ({ ...prev, shipping: { ...prev.shipping, city: e.target.value } }))}
                          className={`input-field ${errors.city ? 'border-red-500 focus:ring-red-500' : ''}`}
                        />
                        {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                          State/Province *
                        </label>
                        <input
                          type="text"
                          id="state"
                          value={formData.shipping.state}
                          onChange={(e) => setFormData(prev => ({ ...prev, shipping: { ...prev.shipping, state: e.target.value } }))}
                          className={`input-field ${errors.state ? 'border-red-500 focus:ring-red-500' : ''}`}
                        />
                        {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP/Postal Code *
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          value={formData.shipping.zipCode}
                          onChange={(e) => setFormData(prev => ({ ...prev, shipping: { ...prev.shipping, zipCode: e.target.value } }))}
                          className={`input-field ${errors.zipCode ? 'border-red-500 focus:ring-red-500' : ''}`}
                        />
                        {errors.zipCode && <p className="mt-1 text-sm text-red-500">{errors.zipCode}</p>}
                      </div>
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <select
                          id="country"
                          value={formData.shipping.country}
                          onChange={(e) => setFormData(prev => ({ ...prev, shipping: { ...prev.shipping, country: e.target.value } }))}
                          className="input-field"
                        >
                          <option value="Pakistan">Pakistan</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {[
                        { value: 'cod', label: 'Cash on Delivery (COD)', desc: 'Pay when you receive your order', icon: Truck },
                        { value: 'card', label: 'Credit/Debit Card', desc: 'Secure online payment via Stripe', icon: CreditCard },
                        { value: 'bank-transfer', label: 'Bank Transfer', desc: 'Direct bank transfer', icon: Shield },
                      ].map(({ value, label, desc, icon: Icon }) => (
                        <label
                          key={value}
                          className={`
                            flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all
                            ${formData.payment.method === value
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-primary-300'
                            }
                          `}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={value}
                            checked={formData.payment.method === value}
                            onChange={(e) => setFormData(prev => ({ ...prev, payment: { ...prev.payment, method: e.target.value as 'cod' | 'card' | 'bank-transfer' } }))}
                            className="w-5 h-5 text-primary-600 border-gray-300 focus:ring-primary-500"
                          />
                          <Icon className="w-10 h-10 text-primary-600" size={24} />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{label}</p>
                            <p className="text-sm text-gray-500">{desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>

                    {formData.payment.method === 'card' && (
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600 mb-3">Card payments processed securely via Stripe. You'll be redirected to complete payment.</p>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                            <input type="text" placeholder="4242 4242 4242 4242" className="input-field" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                              <input type="text" placeholder="MM/YY" className="input-field" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                              <input type="text" placeholder="123" className="input-field" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.payment.method === 'bank-transfer' && (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-medium text-blue-900 mb-2">Bank Transfer Details</h4>
                        <div className="space-y-1 text-sm text-blue-800">
                          <p><strong>Bank:</strong> Habib Bank Limited</p>
                          <p><strong>Account:</strong> Naz Boot House</p>
                          <p><strong>IBAN:</strong> PK12 HABB 0000 0012 3456 7890</p>
                          <p className="mt-2">Please use your order ID as reference. Order will be confirmed once payment is received.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="btn-secondary"
                    >
                      Back
                    </button>
                  )}
                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (validateStep(step)) setStep(step + 1);
                      }}
                      className="btn-primary"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary"
                    >
                      {isSubmitting ? 'Placing Order...' : 'Place Order'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item, index) => (
                  <div key={`${item.productId}-${item.size}-${index}`} className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-sm text-gray-500">Size: {item.size} | Color: {item.color}</p>
                      <p className="text-sm font-medium text-gray-900">{formatPrice(item.price)} × {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">
                    {shipping === 0 ? <span className="text-green-600">Free</span> : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (17%)</span>
                  <span className="font-medium text-gray-900">{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-primary-700">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  By placing your order, you agree to our <a href="/terms" className="text-primary-700 underline">Terms of Service</a> and <a href="/privacy" className="text-primary-700 underline">Privacy Policy</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}