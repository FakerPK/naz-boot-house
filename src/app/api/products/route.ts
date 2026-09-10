import { NextRequest, NextResponse } from 'next/server';
import { getProducts, saveProduct, deleteProduct, initializeSampleData } from '@/lib/db';
import { Product } from '@/types';

export async function GET() {
  try {
    await initializeSampleData();
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('GET products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const product: Product = await request.json();
    
    if (!product.name || !product.description || !product.price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await saveProduct(product);
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('POST product error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const product: Product = await request.json();
    
    if (!product.id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await saveProduct(product);
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('PUT product error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE product error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}