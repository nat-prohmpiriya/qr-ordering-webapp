import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import type { ApiResponse } from '@/types';

/**
 * GET /api/admin/orders/:id
 * Get a single order by ID
 * Protected endpoint - requires authentication
 */
export async function GET(
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

    await connectDB();

    const order = await Order.findById(id)
      .populate('branchId', 'name slug contact')
      .populate('tableId', 'tableNumber capacity')
      .select('-__v')
      .lean();

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
