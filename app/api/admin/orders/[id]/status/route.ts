import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import type { ApiResponse, OrderStatus } from '@/types';

/**
 * PATCH /api/admin/orders/:id/status
 * Update order status
 * Body: { status: OrderStatus }
 * Protected endpoint - requires authentication (staff or owner)
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      const response: ApiResponse = {
        success: false,
        error: 'Unauthorized',
      };
      return NextResponse.json(response, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      const response: ApiResponse = {
        success: false,
        error: 'Order ID is required',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const body = await request.json();
    const { status } = body;

    // Validate status
    const validStatuses: OrderStatus[] = [
      'pending',
      'confirmed',
      'preparing',
      'ready',
      'served',
      'cancelled',
    ];

    if (!status || !validStatuses.includes(status)) {
      const response: ApiResponse = {
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      };
      return NextResponse.json(response, { status: 400 });
    }

    await connectDB();

    // Find order
    const order = await Order.findById(id);

    if (!order) {
      const response: ApiResponse = {
        success: false,
        error: 'Order not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Check if staff user has access to this order
    if (session.user.role === 'staff') {
      if (
        session.user.branchId &&
        order.branchId.toString() !== session.user.branchId
      ) {
        const response: ApiResponse = {
          success: false,
          error: 'Access denied',
        };
        return NextResponse.json(response, { status: 403 });
      }
    }

    // Update order status
    order.status = status;
    await order.save();

    // Emit Socket.io event for status update
    try {
      if (global.io) {
        global.io.to(`order:${id}`).emit('order-status-update', {
          orderId: id,
          status,
          order
        });
      }
    } catch (socketError) {
      console.error('Socket.io emit error:', socketError);
    }

    const response: ApiResponse = {
      success: true,
      data: order,
      message: `Order status updated to ${status}`,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Error updating order status:', error);

    const response: ApiResponse = {
      success: false,
      error: 'Failed to update order status',
    };

    return NextResponse.json(response, { status: 500 });
  }
}
