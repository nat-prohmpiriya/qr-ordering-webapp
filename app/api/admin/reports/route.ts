import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import type { ApiResponse } from '@/types';

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

    await connectDB();

    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build query
    const query: any = {};

    // Role-based filtering
    if (session.user.role === 'staff' && session.user.branchId) {
      query.branchId = session.user.branchId;
    } else if (branchId) {
      query.branchId = branchId;
    }

    // Date range filtering
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Get all orders for the period
    const orders = await Order.find(query)
      .populate('branchId', 'name')
      .sort({ createdAt: -1 })
      .lean();

    // Calculate statistics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Orders by status
    const ordersByStatus = orders.reduce((acc: any, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    // Orders by payment status
    const ordersByPaymentStatus = orders.reduce((acc: any, order) => {
      acc[order.paymentStatus] = (acc[order.paymentStatus] || 0) + 1;
      return acc;
    }, {});

    // Revenue by day (last 7 days if no date range specified)
    const revenueByDay: any = {};
    orders.forEach((order) => {
      const date = new Date(order.createdAt).toISOString().split('T')[0];
      if (!revenueByDay[date]) {
        revenueByDay[date] = {
          date,
          revenue: 0,
          orders: 0,
        };
      }
      revenueByDay[date].revenue += order.total;
      revenueByDay[date].orders += 1;
    });

    const dailyRevenue = Object.values(revenueByDay).sort((a: any, b: any) =>
      a.date.localeCompare(b.date)
    );

    // Top selling items
    const itemSales: any = {};
    orders.forEach((order) => {
      order.items.forEach((item: any) => {
        const itemName = item.name.en;
        if (!itemSales[itemName]) {
          itemSales[itemName] = {
            name: item.name,
            quantity: 0,
            revenue: 0,
          };
        }
        itemSales[itemName].quantity += item.quantity;
        itemSales[itemName].revenue += item.price * item.quantity;
      });
    });

    const topItems = Object.values(itemSales)
      .sort((a: any, b: any) => b.quantity - a.quantity)
      .slice(0, 10);

    const response: ApiResponse = {
      success: true,
      data: {
        summary: {
          totalOrders,
          totalRevenue,
          averageOrderValue,
        },
        ordersByStatus,
        ordersByPaymentStatus,
        dailyRevenue,
        topItems,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching reports:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch reports',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
