import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Table from '@/models/Table';
import MenuItem from '@/models/MenuItem';
import type { ApiResponse } from '@/types';

interface OrderItem {
  menuItemId: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

interface CreateOrderRequest {
  qrCode: string;
  items: OrderItem[];
  customerName?: string;
  customerPhone?: string;
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body: CreateOrderRequest = await request.json();
    const { qrCode, items, customerName, customerPhone } = body;

    // Validate request
    if (!qrCode || !items || items.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: 'QR code and items are required',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Find table by QR code
    const table = await Table.findOne({ qrCode, isActive: true }).lean();

    if (!table) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid QR code or table not active',
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Validate menu items and calculate totals
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId).lean();

      if (!menuItem) {
        const response: ApiResponse = {
          success: false,
          error: `Menu item ${item.menuItemId} not found`,
        };
        return NextResponse.json(response, { status: 404 });
      }

      if (!menuItem.isAvailable) {
        const response: ApiResponse = {
          success: false,
          error: `Menu item ${menuItem.name.en} is not available`,
        };
        return NextResponse.json(response, { status: 400 });
      }

      const itemTotal = menuItem.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        menuItemId: menuItem._id,
        name: menuItem.name,
        quantity: item.quantity,
        price: menuItem.price,
        specialInstructions: item.specialInstructions || undefined,
      });
    }

    // Calculate tax and total (7% VAT)
    const tax = subtotal * 0.07;
    const total = subtotal + tax;

    // Generate order number
    const orderCount = await Order.countDocuments();
    const orderNumber = `ORD${String(orderCount + 1).padStart(6, '0')}`;

    // Create order
    const order = await Order.create({
      orderNumber,
      branchId: table.branchId,
      tableId: table._id,
      items: orderItems,
      subtotal,
      tax,
      total,
      status: 'pending',
      paymentStatus: 'pending',
      customerName: customerName || undefined,
      customerPhone: customerPhone || undefined,
    });

    // Populate order details for response
    const populatedOrder = await Order.findById(order._id)
      .populate('branchId', 'name slug')
      .populate('tableId', 'tableNumber zone')
      .lean();

    const response: ApiResponse = {
      success: true,
      data: populatedOrder,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error('Error creating order:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to create order',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// GET endpoint to retrieve order by ID (for customer order tracking)
export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      const response: ApiResponse = {
        success: false,
        error: 'Order ID is required',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const order = await Order.findById(orderId)
      .populate('branchId', 'name slug address phone')
      .populate('tableId', 'tableNumber zone')
      .lean();

    if (!order) {
      const response: ApiResponse = {
        success: false,
        error: 'Order not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      data: order,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch order',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
