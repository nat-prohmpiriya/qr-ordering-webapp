import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import MenuItem from '@/models/MenuItem';
import type { ApiResponse } from '@/types';

/**
 * GET /api/menu/:id
 * Get a single menu item by ID
 * Public endpoint - no authentication required
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      const response: ApiResponse = {
        success: false,
        error: 'Menu item ID is required',
      };
      return NextResponse.json(response, { status: 400 });
    }

    await connectDB();

    const menuItem = await MenuItem.findById(id)
      .populate('categoryId', 'name slug')
      .select('-__v')
      .lean();

    if (!menuItem) {
      const response: ApiResponse = {
        success: false,
        error: 'Menu item not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      data: menuItem,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching menu item:', error);

    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch menu item',
    };

    return NextResponse.json(response, { status: 500 });
  }
}
