import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, Truck, Mail, Phone, Home } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { getOrder } from '@/lib/db';
import { Order } from '@/types';
import { Suspense } from 'react';

interface OrderSuccessPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

async function OrderSuccessContent({ searchParams }: OrderSuccessPageProps) {
  const params = await searchParams;
  const orderId = params.orderId;
  const order = orderId ? await getOrder(orderId) : null;

  if (!order) {
    return (
      <main className="flex-1 pt-16">
        <div className="container-custom py-16 text-center">
          <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-500 mb-8">Thank you for your order. We'll send a confirmation email shortly.</p>
          <Link href="/" className="btn-primary inline-flex">Continue Shopping</Link>
        </div>
      </main>
    );
  }

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = order.shippingCost;
  const tax = order.tax;
  const total = order.total;

  return (
    <main className="flex-1 pt-16">
      <div className="container-custom py-8">
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-500">Thank you for shopping with Naz Boot House</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="text-primary-600" size={20} />
                Order Details
              </h2>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Order Number</dt>
                  <dd className="font-medium text-gray-900">{order.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Order Date</dt>
                  <dd className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-PK', { 
                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                  })}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Status</dt>
                  <dd className="font-medium text-primary-700 capitalize">{order.status}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Payment Method</dt>
                  <dd className="font-medium text-gray-900 capitalize">{order.payment.method.replace('-', ' ')}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Truck className="text-primary-600" size={20} />
                Shipping Address
              </h2>
              <address className="not-italic text-gray-700 space-y-1">
                <p className="font-medium">{order.customer.firstName} {order.customer.lastName}</p>
                <p>{order.shipping.address}</p>
                <p>{order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}</p>
                <p>{order.shipping.country}</p>
                <p className="mt-2"><Phone className="inline text-primary-600" size={16} /> {order.customer.phone}</p>
                <p><Mail className="inline text-primary-600" size={16} /> {order.customer.email}</p>
              </address>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {order.items.map((item, index) => (
                  <div key={`${item.productId}-${item.size}-${index}`} className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-sm text-gray-500">Size: {item.size} | Color: {item.color}</p>
                      <p className="text-sm font-medium text-gray-900">{formatPrice(item.price)} &times; {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({order.items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
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

              <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-2">
                <p className="text-sm text-gray-600">
                  A confirmation email has been sent to <strong>{order.customer.email}</strong>
                </p>
                <p className="text-sm text-gray-600">
                  You'll receive shipping updates via SMS on <strong>{order.customer.phone}</strong>
                </p>
                {order.payment.method === 'bank-transfer' && (
                  <p className="text-sm text-blue-700 bg-blue-50 p-2 rounded">
                    Please complete bank transfer to confirm your order. Use Order ID: <strong>{order.id}</strong> as reference.
                  </p>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <Link href="/account/orders" className="btn-primary text-center">
                  View Order History
                </Link>
                <Link href="/" className="btn-secondary text-center">
                  <Home size={18} className="mr-2" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  return (
    <Suspense fallback={
      <main className="flex-1 pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent" />
      </main>
    }>
      <OrderSuccessContent searchParams={searchParams} />
    </Suspense>
  );
}

export const dynamic = 'force-dynamic';