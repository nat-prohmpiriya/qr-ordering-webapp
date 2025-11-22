import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import type { ApiResponse } from '@/types';

/**
 * GET /api/admin/orders
 * List orders with optional filtering
 * Query params:
 *   - branchId: Filter by branch
 *   - status: Filter by order status
 *   - paymentStatus: Filter by payment status
 *   - limit: Limit results (default: 50)
 *   - offset: Skip results (default: 0)
 * Protected endpoint - requires authentication
 */
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      const response: ApiResponse = {
        success: false,
        error: 'Unauthorized',
      };
      return NextResponse.json(response, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    await connectDB();

    // Build query
    const query: any = {};

    // If user is staff, only show orders from their branch
    if (session.user.role === 'staff' && session.user.branchId) {
      query.branchId = session.user.branchId;
    } else if (branchId) {
      // Owner can filter by branch
      query.branchId = branchId;
    }

    if (status) {
      query.status = status;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    // Get orders with pagination
    const orders = await Order.find(query)
      .populate('branchId', 'name slug')
      .populate('tableId', 'tableNumber')
      .select('-__v')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .lean();

    // Get total count
    const total = await Order.countDocuments(query);

    const response: ApiResponse = {
      success: true,
      data: {
        orders,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching orders:', error);

    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch orders',
    };

    return NextResponse.json(response, { status: 500 });
  }
}
