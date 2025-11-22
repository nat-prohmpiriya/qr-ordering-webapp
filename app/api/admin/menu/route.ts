import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import MenuItem from '@/models/MenuItem';
import type { ApiResponse } from '@/types';

/**
 * GET /api/admin/menu
 * List all menu items (admin view)
 * Query params:
 *   - categoryId: Filter by category
 *   - isAvailable: Filter by availability
 * Protected endpoint - requires owner role
 */
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.role !== 'owner') {
      const response: ApiResponse = {
        success: false,
        error: 'Unauthorized - Owner access required',
      };
      return NextResponse.json(response, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const isAvailable = searchParams.get('isAvailable');

    await connectDB();

    // Build query
    const query: any = {};

    if (categoryId) {
      query.categoryId = categoryId;
    }

    if (isAvailable !== null) {
      query.isAvailable = isAvailable === 'true';
    }

    const menuItems = await MenuItem.find(query)
      .populate('categoryId', 'name slug')
      .select('-__v')
      .sort({ categoryId: 1, createdAt: -1 })
      .lean();

    const response: ApiResponse = {
      success: true,
      data: menuItems,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching menu items:', error);

    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch menu items',
    };

    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * POST /api/admin/menu
 * Create a new menu item
 * Protected endpoint - requires owner role
 */
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.role !== 'owner') {
      const response: ApiResponse = {
        success: false,
        error: 'Unauthorized - Owner access required',
      };
      return NextResponse.json(response, { status: 403 });
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['categoryId', 'name', 'price'];
    for (const field of requiredFields) {
      if (!body[field]) {
        const response: ApiResponse = {
          success: false,
          error: `Missing required field: ${field}`,
        };
        return NextResponse.json(response, { status: 400 });
      }
    }

    await connectDB();

    // Create menu item
    const menuItem = await MenuItem.create({
      categoryId: body.categoryId,
      name: body.name,
      description: body.description || undefined,
      price: body.price,
      image: body.image || null,
      spicyLevel: body.spicyLevel || 0,
      allergens: body.allergens || [],
      isAvailable: body.isAvailable !== undefined ? body.isAvailable : true,
      isVegetarian: body.isVegetarian || false,
      preparationTime: body.preparationTime || 10,
    });

    const response: ApiResponse = {
      success: true,
      data: menuItem,
      message: 'Menu item created successfully',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error('Error creating menu item:', error);

    const response: ApiResponse = {
      success: false,
      error: 'Failed to create menu item',
    };

    return NextResponse.json(response, { status: 500 });
  }
}
