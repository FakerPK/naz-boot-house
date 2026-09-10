'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Edit, Trash2, Search, Filter, X, Eye, Download, Upload,
  Package, Tag, DollarSign, Box, Camera, Save, ChevronLeft, ChevronRight,
  Image, Loader2, MoreHorizontal
} from 'lucide-react';
import { Product, CATEGORIES, SIZES, SizeStock, ColorOption } from '@/types';
import { formatPrice, cn } from '@/lib/utils';

const ADMIN_PASSWORD = 'nazadmin';
const ADMIN_SESSION_KEY = 'naz-boot-house-admin-session';

interface AdminFormData {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: Product['category'];
  brand: string;
  images: string[];
  sizes: SizeStock[];
  colors: ColorOption[];
  featured: boolean;
  isNew: boolean;
  onSale: boolean;
  tags: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    setIsAuthenticated(sessionStorage.getItem(ADMIN_SESSION_KEY) === 'authenticated');
    setIsAuthReady(true);
  }, []);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'authenticated');
      setIsAuthenticated(true);
      setLoginError('');
      setPassword('');
    } else {
      setLoginError('That password is not correct.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthenticated(false);
  };

  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration.scope);
        })
        .catch((error) => {
          console.log('SW registration failed:', error);
        });
    }
  }, []);

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<AdminFormData>({
    name: '',
    description: '',
    price: 0,
    originalPrice: undefined,
    category: 'shoes',
    brand: 'Naz Boot House',
    images: [''],
    sizes: SIZES.map(size => ({ size, stock: 0 })),
    colors: [{ name: '', hex: '#000000', images: [] }],
    featured: false,
    isNew: false,
    onSale: false,
    tags: '',
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>(['']);
  const [colorPreviews, setColorPreviews] = useState<string[]>(['']);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.images?.[0]) newErrors.images = 'At least one image is required';
    if (!formData.sizes?.some(s => s.stock > 0)) newErrors.sizes = 'At least one size with stock is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const productData: Product = {
      id: editingProduct?.id || `prod-${Date.now()}`,
      name: formData.name!,
      description: formData.description!,
      price: formData.price!,
      originalPrice: formData.originalPrice,
      images: formData.images!.filter(Boolean),
      category: formData.category as Product['category'],
      brand: formData.brand || 'Naz Boot House',
      sizes: formData.sizes!,
      colors: formData.colors!.filter(c => c.name && c.hex),
      featured: formData.featured || false,
      isNew: formData.isNew || false,
      onSale: formData.onSale || false,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      createdAt: editingProduct?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/products', {
        method: editingProduct ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        fetchProducts();
        closeModal();
      } else {
        throw new Error('Failed to save product');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        category: product.category,
        brand: product.brand,
        images: product.images,
        sizes: product.sizes,
        colors: product.colors,
        featured: product.featured,
        isNew: product.isNew,
        onSale: product.onSale,
        tags: product.tags.join(', '),
      });
      setImagePreviews(product.images.length ? product.images : ['']);
      setColorPreviews(product.colors.map(c => c.hex));
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        originalPrice: undefined,
        category: 'shoes',
        brand: 'Naz Boot House',
        images: [''],
        sizes: SIZES.map(size => ({ size, stock: 0 })),
        colors: [{ name: '', hex: '#000000', images: [] }],
        featured: false,
        isNew: false,
        onSale: false,
        tags: '',
      });
      setImagePreviews(['']);
      setColorPreviews(['']);
    }
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleImageUpload = async (file: File, index: number) => {
    setUploadingIndex(index);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      
      const newImages = [...(formData.images || [])];
      newImages[index] = data.url;
      setFormData(prev => ({ ...prev, images: newImages }));
      const newPreviews = [...imagePreviews];
      newPreviews[index] = data.url;
      setImagePreviews(newPreviews);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingIndex(null);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.touches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      setTouchStartX(null);
    }
  };

  if (!isAuthReady) {
    return <main className="flex min-h-screen items-center justify-center bg-background"><div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" /></main>;
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-secondary px-5 py-10">
        <div className="w-full max-w-md border border-border bg-card p-6 shadow-xl sm:p-9">
          <div className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-accent">Naz Boot House</p>
            <h1 className="font-serif text-4xl text-foreground">Admin access</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Sign in to manage the product catalogue.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <label className="block text-sm font-medium text-foreground" htmlFor="admin-password">Password
              <input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="input-field mt-2 w-full" placeholder="Enter admin password" required />
            </label>
            {loginError && <p role="alert" className="text-sm text-destructive">{loginError}</p>}
            <button type="submit" className="btn-primary w-full">Unlock dashboard</button>
          </form>
          <p className="mt-6 text-center text-xs text-muted-foreground">Password is configured in <code>src/app/admin/page.tsx</code>.</p>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex-1 pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="flex-1 pt-16 min-h-screen bg-gray-50 pb-24">
      <div className="container-custom py-6 px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">Manage your product catalog</p>
          </div>
          <div className="flex w-full gap-2 sm:w-auto">
            <button type="button" onClick={handleLogout} className="btn-secondary flex-1 px-4 py-3 sm:flex-none">Log out</button>
            <button 
            onClick={() => openModal()} 
            className="btn-primary flex items-center gap-2 w-full sm:w-auto py-3 px-6 text-base"
            style={{ minHeight: '48px' }}
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add</span>
          </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex flex-col gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10 py-3 text-base"
                style={{ minHeight: '48px' }}
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field w-full sm:w-auto py-3 text-base"
              style={{ minHeight: '48px' }}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto -mx-4 px-4" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Brand</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                          {product.images[0] && (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{product.name}</p>
                          <p className="text-xs text-gray-500 truncate max-w-xs">{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="capitalize text-sm text-gray-700">
                        {product.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell text-sm text-gray-700">{product.brand}</td>
                    <td className="px-4 py-4 text-right font-medium text-gray-900">
                      {formatPrice(product.price)}
                      {product.originalPrice && (
                        <span className="ml-2 text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={cn(
                        'px-3 py-1 text-xs font-medium rounded-full',
                        product.sizes.some(s => s.stock > 0) ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      )}>
                        {product.sizes.reduce((sum, s) => sum + s.stock, 0)} in stock
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-1 flex-wrap">
                        {product.featured && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded">Featured</span>}
                        {product.isNew && <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded">New</span>}
                        {product.onSale && <span className="px-2 py-0.5 bg-accent-100 text-accent-700 text-xs rounded">Sale</span>}
                        {!product.featured && !product.isNew && !product.onSale && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">Regular</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal(product)}
                          className="p-3 text-gray-500 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                          aria-label="Edit product"
                          style={{ minWidth: '44px', minHeight: '44px' }}
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Delete product"
                          style={{ minWidth: '44px', minHeight: '44px' }}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className="p-8 text-center">
                <Package className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Add your first product to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 overflow-y-auto" onClick={closeModal}>
          <div 
            className="bg-white rounded-xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button 
                onClick={closeModal} 
                className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                      placeholder="Enter product name"
                      style={{ minHeight: '48px', fontSize: '16px' }}
                      autoComplete="off"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                      rows={4}
                      value={formData.description || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className={`input-field ${errors.description ? 'border-red-500' : ''}`}
                      placeholder="Describe the product features, materials, etc."
                      style={{ fontSize: '16px' }}
                    />
                    {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (PKR) *</label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={formData.price || 0}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                        className={`input-field ${errors.price ? 'border-red-500' : ''}`}
                        style={{ minHeight: '48px', fontSize: '16px' }}
                        inputMode="numeric"
                      />
                      {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (PKR)</label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={formData.originalPrice || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value ? parseInt(e.target.value) : undefined }))}
                        className="input-field"
                        placeholder="For sale items"
                        style={{ minHeight: '48px', fontSize: '16px' }}
                        inputMode="numeric"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select
                      value={formData.category || 'shoes'}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Product['category'] }))}
                      className="input-field"
                      style={{ minHeight: '48px', fontSize: '16px' }}
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <input
                      type="text"
                      value={formData.brand || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                      className="input-field"
                      style={{ minHeight: '48px', fontSize: '16px' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={formData.tags || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                      className="input-field"
                      placeholder="formal, leather, oxford, office"
                      style={{ minHeight: '48px', fontSize: '16px' }}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <label className="flex items-center gap-3 cursor-pointer" style={{ minHeight: '44px' }}>
                      <input
                        type="checkbox"
                        checked={formData.featured || false}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                        className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Featured</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer" style={{ minHeight: '44px' }}>
                      <input
                        type="checkbox"
                        checked={formData.isNew || false}
                        onChange={(e) => setFormData(prev => ({ ...prev, isNew: e.target.checked }))}
                        className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">New Arrival</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer" style={{ minHeight: '44px' }}>
                      <input
                        type="checkbox"
                        checked={formData.onSale || false}
                        onChange={(e) => setFormData(prev => ({ ...prev, onSale: e.target.checked }))}
                        className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">On Sale</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">Images *</label>
                      <button
                        type="button"
                        onClick={() => setImagePreviews(prev => [...prev, ''])}
                        className="text-sm text-primary-700 hover:text-primary-800 flex items-center gap-1 py-2 px-3"
                        style={{ minHeight: '44px' }}
                      >
                        <Plus size={16} /> Add Image
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          {preview ? (
                            <>
                              <img src={preview} alt={`Preview ${index + 1}`} className="w-full aspect-square object-cover rounded-lg" />
                              <button
                                type="button"
                                onClick={() => {
                                  const newPreviews = imagePreviews.filter((_, i) => i !== index);
                                  setImagePreviews(newPreviews.length ? newPreviews : ['']);
                                  setFormData(prev => ({ ...prev, images: prev.images?.filter((_, i) => i !== index) || [] }));
                                }}
                                className="absolute top-1 right-1 w-8 h-8 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                style={{ minWidth: '44px', minHeight: '44px' }}
                              >
                                <X size={16} />
                              </button>
                              <input
                                type="url"
                                value={preview}
                                onChange={(e) => {
                                  const newImages = [...(formData.images || [])];
                                  newImages[index] = e.target.value;
                                  setFormData(prev => ({ ...prev, images: newImages }));
                                  const newPreviews = [...imagePreviews];
                                  newPreviews[index] = e.target.value;
                                  setImagePreviews(newPreviews);
                                }}
                                className="absolute bottom-1 left-1 right-1 bg-white/90 text-xs px-2 rounded truncate"
                                placeholder="Image URL"
                                style={{ fontSize: '16px' }}
                              />
                            </>
                          ) : (
                            <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-2 bg-gray-50">
                              <Camera className="text-gray-400 mb-1" size={24} />
                              <input
                                type="url"
                                placeholder="Image URL"
                                onChange={(e) => {
                                  const newImages = [...(formData.images || [])];
                                  newImages[index] = e.target.value;
                                  setFormData(prev => ({ ...prev, images: newImages }));
                                  const newPreviews = [...imagePreviews];
                                  newPreviews[index] = e.target.value;
                                  setImagePreviews(newPreviews);
                                }}
                                className="w-full text-sm text-center bg-transparent focus:outline-none"
                                style={{ fontSize: '16px' }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {errors.images && <p className="mt-1 text-sm text-red-500">{errors.images}</p>}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">Color Variants</label>
                      <button
                        type="button"
                        onClick={() => {
                          setColorPreviews(prev => [...prev, '#000000']);
                          setFormData(prev => ({ ...prev, colors: [...(prev.colors || []), { name: '', hex: '#000000', images: [] }] }));
                        }}
                        className="text-sm text-primary-700 hover:text-primary-800 flex items-center gap-1 py-2 px-3"
                        style={{ minHeight: '44px' }}
                      >
                        <Plus size={16} /> Add Color
                      </button>
                    </div>
                    <div className="space-y-3">
                      {(formData.colors || []).map((color, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                          <input
                            type="color"
                            value={color.hex}
                            onChange={(e) => {
                              const newColors = [...(formData.colors || [])];
                              newColors[index] = { ...newColors[index], hex: e.target.value };
                              setFormData(prev => ({ ...prev, colors: newColors }));
                              const newPreviews = [...colorPreviews];
                              newPreviews[index] = e.target.value;
                              setColorPreviews(newPreviews);
                            }}
                            className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                            style={{ minWidth: '44px', minHeight: '44px' }}
                          />
                          <div className="flex-1">
                            <input
                              type="text"
                              placeholder="Color name (e.g., Black, Navy, Tan)"
                              value={color.name}
                              onChange={(e) => {
                                const newColors = [...(formData.colors || [])];
                                newColors[index] = { ...newColors[index], name: e.target.value };
                                setFormData(prev => ({ ...prev, colors: newColors }));
                              }}
                              className="input-field text-sm"
                              style={{ minHeight: '44px', fontSize: '16px' }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newColors = (formData.colors || []).filter((_, i) => i !== index);
                              setFormData(prev => ({ ...prev, colors: newColors }));
                              setColorPreviews(prev => prev.filter((_, i) => i !== index));
                            }}
                            className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                            style={{ minWidth: '44px', minHeight: '44px' }}
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sizes & Stock *</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {(formData.sizes || []).map((sizeStock, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                      <span className="text-sm font-medium text-gray-700 w-10">{sizeStock.size}</span>
                      <input
                        type="number"
                        min="0"
                        max="999"
                        value={sizeStock.stock}
                        onChange={(e) => {
                          const newSizes = [...(formData.sizes || [])];
                          newSizes[index] = { ...newSizes[index], stock: parseInt(e.target.value) || 0 };
                          setFormData(prev => ({ ...prev, sizes: newSizes }));
                        }}
                        className="input-field text-center w-16"
                        style={{ minHeight: '48px', fontSize: '16px' }}
                        inputMode="numeric"
                      />
                    </div>
                  ))}
                </div>
                {errors.sizes && <p className="mt-1 text-sm text-red-500">{errors.sizes}</p>}
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={closeModal} 
                  className="btn-secondary w-full sm:w-auto py-3 px-6"
                  style={{ minHeight: '48px' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary flex items-center gap-2 w-full sm:w-auto py-3 px-6"
                  style={{ minHeight: '48px' }}
                >
                  <Save size={20} />
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
