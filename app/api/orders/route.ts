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

    console.log('[Order Creation] Request body:', JSON.stringify(body, null, 2));

    // Validate request
    if (!qrCode || !items || items.length === 0) {
      console.log('[Order Creation] Validation failed: missing qrCode or items');
      const response: ApiResponse = {
        success: false,
        error: 'QR code and items are required',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Find table by QR code
    console.log('[Order Creation] Looking for table with QR code:', qrCode);
    const table = await Table.findOne({ qrCode, isActive: true }).lean();

    if (!table) {
      console.log('[Order Creation] Table not found or not active for QR code:', qrCode);
      const response: ApiResponse = {
        success: false,
        error: 'Invalid QR code or table not active',
      };
      return NextResponse.json(response, { status: 404 });
    }

    console.log('[Order Creation] Table found:', { tableId: table._id, tableNumber: table.tableNumber, branchId: table.branchId });

    // Validate menu items and calculate totals
    const orderItems = [];
    let subtotal = 0;

    console.log('[Order Creation] Validating menu items...');
    for (const item of items) {
      console.log('[Order Creation] Looking for menu item:', item.menuItemId);
      const menuItem = await MenuItem.findById(item.menuItemId).lean();

      if (!menuItem) {
        console.log('[Order Creation] Menu item not found:', item.menuItemId);
        const response: ApiResponse = {
          success: false,
          error: `Menu item ${item.menuItemId} not found`,
        };
        return NextResponse.json(response, { status: 404 });
      }

      if (!menuItem.isAvailable) {
        console.log('[Order Creation] Menu item not available:', menuItem.name.en);
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
      console.log('[Order Creation] Menu item validated:', { name: menuItem.name.en, price: menuItem.price, quantity: item.quantity });
    }
    console.log('[Order Creation] All menu items validated. Subtotal:', subtotal);

    // Calculate tax and total (7% VAT)
    const tax = subtotal * 0.07;
    const total = subtotal + tax;

    console.log('[Order Creation] Calculating totals:', { subtotal, tax, total });

    // Generate order number
    const orderCount = await Order.countDocuments();
    const orderNumber = `ORD${String(orderCount + 1).padStart(6, '0')}`;

    console.log('[Order Creation] Generated order number:', orderNumber);

    // Generate session ID (unique identifier for this dining session)
    const sessionId = `SESSION_${table._id}_${Date.now()}`;

    console.log('[Order Creation] Generated session ID:', sessionId);

    // Create order
    const orderData = {
      orderNumber,
      branchId: table.branchId,
      tableId: table._id,
      sessionId,
      items: orderItems,
      subtotal,
      tax,
      total,
      status: 'pending',
      paymentStatus: 'pending',
      customerName: customerName || undefined,
      customerPhone: customerPhone || undefined,
    };

    console.log('[Order Creation] Creating order with data:', JSON.stringify(orderData, null, 2));

    const order = await Order.create(orderData);

    console.log('[Order Creation] Order created successfully:', order._id);

    // Populate order details for response
    const populatedOrder = await Order.findById(order._id)
      .populate('branchId', 'name slug')
      .populate('tableId', 'tableNumber zone')
      .lean();

    // Emit Socket.io event for new order
    try {
      if (global.io) {
        global.io.to(`branch:${table.branchId.toString()}`).emit('new-order', populatedOrder);
      }
    } catch (socketError) {
      console.error('Socket.io emit error:', socketError);
    }

    const response: ApiResponse = {
      success: true,
      data: populatedOrder,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error('[Order Creation] ERROR:', error);
    console.error('[Order Creation] Error message:', error.message);
    console.error('[Order Creation] Error stack:', error.stack);
    if (error.name === 'ValidationError') {
      console.error('[Order Creation] Validation errors:', error.errors);
    }
    const response: ApiResponse = {
      success: false,
      error: error.message || 'Failed to create order',
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
