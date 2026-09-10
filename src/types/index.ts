export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: 'shoes' | 'slippers' | 'school-shoes' | 'sports' | 'casual' | 'formal';
  brand: string;
  sizes: SizeStock[];
  colors: ColorOption[];
  featured: boolean;
  isNew: boolean;
  onSale: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SizeStock {
  size: string;
  stock: number;
}

export interface ColorOption {
  name: string;
  hex: string;
  images: string[];
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  brand: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: CustomerInfo;
  shipping: ShippingInfo;
  payment: PaymentInfo;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface ShippingInfo {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentInfo {
  method: 'cod' | 'card' | 'bank-transfer';
  cardLast4?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export const CATEGORIES: Category[] = [
  {
    id: 'shoes',
    name: 'Shoes',
    slug: 'shoes',
    description: 'Premium footwear for every occasion',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
    productCount: 0,
  },
  {
    id: 'slippers',
    name: 'Slippers',
    slug: 'slippers',
    description: 'Comfortable indoor and outdoor slippers',
    image: 'https://images.unsplash.com/photo-1584735174923-1e5b1b4d0d4b?w=800',
    productCount: 0,
  },
  {
    id: 'school-shoes',
    name: 'School Shoes',
    slug: 'school-shoes',
    description: 'Durable and comfortable school footwear',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800',
    productCount: 0,
  },
  {
    id: 'sports',
    name: 'Sports',
    slug: 'sports',
    description: 'Athletic shoes for performance',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
    productCount: 0,
  },
  {
    id: 'casual',
    name: 'Casual',
    slug: 'casual',
    description: 'Everyday comfortable footwear',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800',
    productCount: 0,
  },
  {
    id: 'formal',
    name: 'Formal',
    slug: 'formal',
    description: 'Professional dress shoes',
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800',
    productCount: 0,
  },
];

export const SIZES = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];