import { Redis } from '@upstash/redis';
import { Product, CartItem, Order, CATEGORIES } from '@/types';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const PRODUCTS_KEY = 'products';
const ORDERS_KEY = 'orders';
const CART_PREFIX = 'cart:';

export async function getProducts(): Promise<Product[]> {
  try {
    const products = await redis.get<Product[]>(PRODUCTS_KEY);
    return products || [];
  } catch (error) {
    console.error('Redis getProducts error:', error);
    throw error;
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find(p => p.id === id) || null;
}

export async function saveProduct(product: Product): Promise<void> {
  const products = await getProducts();
  const index = products.findIndex(p => p.id === product.id);
  if (index >= 0) {
    products[index] = { ...product, updatedAt: new Date().toISOString() };
  } else {
    products.push({ ...product, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  await redis.set(PRODUCTS_KEY, products);
}

export async function deleteProduct(id: string): Promise<void> {
  const products = await getProducts();
  const filtered = products.filter(p => p.id !== id);
  await redis.set(PRODUCTS_KEY, filtered);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = await getProducts();
  return products.filter(p => p.category === category);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter(p => p.featured);
}

export async function getNewProducts(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter(p => p.isNew).slice(0, 8);
}

export async function getSaleProducts(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter(p => p.onSale).slice(0, 8);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const products = await getProducts();
  const lowerQuery = query.toLowerCase();
  return products.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.brand.toLowerCase().includes(lowerQuery) ||
    p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export async function getCart(sessionId: string): Promise<CartItem[]> {
  try {
    const cart = await redis.get<CartItem[]>(`${CART_PREFIX}${sessionId}`);
    return cart || [];
  } catch {
    return [];
  }
}

export async function saveCart(sessionId: string, items: CartItem[]): Promise<void> {
  await redis.set(`${CART_PREFIX}${sessionId}`, items);
}

export async function clearCart(sessionId: string): Promise<void> {
  await redis.del(`${CART_PREFIX}${sessionId}`);
}

export async function createOrder(order: Order): Promise<void> {
  const orders = await getOrders();
  orders.unshift(order);
  await redis.set(ORDERS_KEY, orders);
}

export async function getOrders(): Promise<Order[]> {
  try {
    const orders = await redis.get<Order[]>(ORDERS_KEY);
    return orders || [];
  } catch {
    return [];
  }
}

export async function getOrder(id: string): Promise<Order | null> {
  const orders = await getOrders();
  return orders.find(o => o.id === id) || null;
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<void> {
  const orders = await getOrders();
  const index = orders.findIndex(o => o.id === id);
  if (index >= 0) {
    orders[index].status = status;
    orders[index].updatedAt = new Date().toISOString();
    await redis.set(ORDERS_KEY, orders);
  }
}

export async function initializeSampleData(): Promise<void> {
  const existingProducts = await getProducts();
  if (existingProducts.length > 0) return;

  const sampleProducts: Product[] = [
    {
      id: '1',
      name: 'Classic Leather Oxford',
      description: 'Premium full-grain leather oxford shoes with Goodyear welt construction. Perfect for formal occasions and professional settings.',
      price: 12999,
      originalPrice: 15999,
      images: [
        'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800',
        'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800',
      ],
      category: 'formal',
      brand: 'Naz Boot House',
      sizes: [
        { size: '39', stock: 5 }, { size: '40', stock: 8 }, { size: '41', stock: 10 },
        { size: '42', stock: 12 }, { size: '43', stock: 8 }, { size: '44', stock: 5 },
      ],
      colors: [
        { name: 'Black', hex: '#000000', images: ['https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800'] },
        { name: 'Brown', hex: '#8B4513', images: ['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800'] },
      ],
      featured: true,
      isNew: false,
      onSale: true,
      tags: ['formal', 'leather', 'oxford', 'office'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Running Pro Max',
      description: 'Lightweight running shoes with responsive cushioning and breathable mesh upper. Engineered for long-distance comfort.',
      price: 8999,
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
        'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800',
      ],
      category: 'sports',
      brand: 'Naz Boot House',
      sizes: [
        { size: '38', stock: 3 }, { size: '39', stock: 6 }, { size: '40', stock: 10 },
        { size: '41', stock: 12 }, { size: '42', stock: 10 }, { size: '43', stock: 6 },
        { size: '44', stock: 3 },
      ],
      colors: [
        { name: 'Black/White', hex: '#000000', images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'] },
        { name: 'Blue/Orange', hex: '#1E3A8A', images: ['https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800'] },
        { name: 'Gray/Green', hex: '#6B7280', images: [] },
      ],
      featured: true,
      isNew: true,
      onSale: false,
      tags: ['running', 'sports', 'athletic', 'mesh'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Comfort Slip-On Slippers',
      description: 'Ultra-soft memory foam slippers with non-slip sole. Perfect for indoor comfort all day long.',
      price: 2499,
      originalPrice: 3499,
      images: [
        'https://images.unsplash.com/photo-1584735174923-1e5b1b4d0d4b?w=800',
      ],
      category: 'slippers',
      brand: 'Naz Boot House',
      sizes: [
        { size: '38', stock: 15 }, { size: '39', stock: 20 }, { size: '40', stock: 25 },
        { size: '41', stock: 20 }, { size: '42', stock: 15 }, { size: '43', stock: 10 },
      ],
      colors: [
        { name: 'Navy', hex: '#1E3A8A', images: ['https://images.unsplash.com/photo-1584735174923-1e5b1b4d0d4b?w=800'] },
        { name: 'Gray', hex: '#6B7280', images: [] },
        { name: 'Brown', hex: '#8B4513', images: [] },
      ],
      featured: false,
      isNew: false,
      onSale: true,
      tags: ['slippers', 'comfort', 'indoor', 'memory-foam'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'School Leather Derby',
      description: 'Durable leather school shoes with reinforced toe cap and anti-slip sole. Built to last the entire school year.',
      price: 4999,
      images: [
        'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800',
        'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800',
      ],
      category: 'school-shoes',
      brand: 'Naz Boot House',
      sizes: [
        { size: '32', stock: 10 }, { size: '33', stock: 15 }, { size: '34', stock: 20 },
        { size: '35', stock: 25 }, { size: '36', stock: 20 }, { size: '37', stock: 15 },
        { size: '38', stock: 10 }, { size: '39', stock: 5 },
      ],
      colors: [
        { name: 'Black', hex: '#000000', images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800'] },
      ],
      featured: true,
      isNew: false,
      onSale: false,
      tags: ['school', 'leather', 'durable', 'kids'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '5',
      name: 'Casual Canvas Sneakers',
      description: 'Versatile canvas sneakers with vulcanized rubber sole. Classic style for everyday wear.',
      price: 3999,
      images: [
        'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800',
      ],
      category: 'casual',
      brand: 'Naz Boot House',
      sizes: [
        { size: '38', stock: 12 }, { size: '39', stock: 18 }, { size: '40', stock: 22 },
        { size: '41', stock: 20 }, { size: '42', stock: 15 }, { size: '43', stock: 10 },
        { size: '44', stock: 5 },
      ],
      colors: [
        { name: 'White', hex: '#FFFFFF', images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800'] },
        { name: 'Black', hex: '#000000', images: [] },
        { name: 'Navy', hex: '#1E3A8A', images: [] },
      ],
      featured: false,
      isNew: true,
      onSale: false,
      tags: ['casual', 'canvas', 'sneakers', 'everyday'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '6',
      name: 'Premium Chelsea Boots',
      description: 'Handcrafted Chelsea boots in premium suede with elastic side panels. Timeless style for any season.',
      price: 14999,
      originalPrice: 18999,
      images: [
        'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800',
      ],
      category: 'shoes',
      brand: 'Naz Boot House',
      sizes: [
        { size: '39', stock: 4 }, { size: '40', stock: 8 }, { size: '41', stock: 10 },
        { size: '42', stock: 8 }, { size: '43', stock: 6 }, { size: '44', stock: 3 },
      ],
      colors: [
        { name: 'Tan', hex: '#D2B48C', images: ['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800'] },
        { name: 'Black', hex: '#000000', images: [] },
        { name: 'Dark Brown', hex: '#654321', images: [] },
      ],
      featured: true,
      isNew: false,
      onSale: true,
      tags: ['boots', 'chelsea', 'suede', 'premium'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  await redis.set(PRODUCTS_KEY, sampleProducts);
}

export function getCategories() {
  return CATEGORIES;
}