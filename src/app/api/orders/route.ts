import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { Order } from '@/types';

const ORDERS_KEY = 'orders';

export async function GET() {
  try {
    const orders = await kv.get<Order[]>(ORDERS_KEY);
    return NextResponse.json(orders || []);
  } catch (error) {
    console.error('GET orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const order: Order = await request.json();
    
    if (!order.id || !order.items?.length || !order.customer || !order.shipping) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingOrders = await kv.get<Order[]>(ORDERS_KEY) || [];
    existingOrders.unshift(order);
    await kv.set(ORDERS_KEY, existingOrders);

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('POST order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    
    if (!id || !status) {
      return NextResponse.json({ error: 'Order ID and status are required' }, { status: 400 });
    }

    const orders = await kv.get<Order[]>(ORDERS_KEY) || [];
    const index = orders.findIndex(o => o.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    orders[index].status = status;
    orders[index].updatedAt = new Date().toISOString();
    await kv.set(ORDERS_KEY, orders);

    return NextResponse.json({ success: true, order: orders[index] });
  } catch (error) {
    console.error('PUT order error:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}