import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import MenuItem from '@/models/MenuItem';
import type { ApiResponse } from '@/types';

/**
 * PUT /api/admin/menu/:id
 * Update a menu item
 * Protected endpoint - requires owner role
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.role !== 'owner') {
      const response: ApiResponse = {
        success: false,
        error: 'Unauthorized - Owner access required',
      };
      return NextResponse.json(response, { status: 403 });
    }

    const { id } = await params;

    if (!id) {
      const response: ApiResponse = {
        success: false,
        error: 'Menu item ID is required',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const body = await request.json();

    await connectDB();

    // Find and update menu item
    const menuItem = await MenuItem.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(body.categoryId && { categoryId: body.categoryId }),
          ...(body.name && { name: body.name }),
          ...(body.description !== undefined && { description: body.description }),
          ...(body.price !== undefined && { price: body.price }),
          ...(body.image !== undefined && { image: body.image }),
          ...(body.spicyLevel !== undefined && { spicyLevel: body.spicyLevel }),
          ...(body.allergens !== undefined && { allergens: body.allergens }),
          ...(body.isAvailable !== undefined && { isAvailable: body.isAvailable }),
          ...(body.isVegetarian !== undefined && { isVegetarian: body.isVegetarian }),
          ...(body.preparationTime !== undefined && { preparationTime: body.preparationTime }),
        },
      },
      { new: true, runValidators: true }
    )
      .populate('categoryId', 'name slug')
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
      message: 'Menu item updated successfully',
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Error updating menu item:', error);

    const response: ApiResponse = {
      success: false,
      error: 'Failed to update menu item',
    };

    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * DELETE /api/admin/menu/:id
 * Delete a menu item
 * Protected endpoint - requires owner role
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.role !== 'owner') {
      const response: ApiResponse = {
        success: false,
        error: 'Unauthorized - Owner access required',
      };
      return NextResponse.json(response, { status: 403 });
    }

    const { id } = await params;

    if (!id) {
      const response: ApiResponse = {
        success: false,
        error: 'Menu item ID is required',
      };
      return NextResponse.json(response, { status: 400 });
    }

    await connectDB();

    const menuItem = await MenuItem.findByIdAndDelete(id);

    if (!menuItem) {
      const response: ApiResponse = {
        success: false,
        error: 'Menu item not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      message: 'Menu item deleted successfully',
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting menu item:', error);

    const response: ApiResponse = {
      success: false,
      error: 'Failed to delete menu item',
    };

    return NextResponse.json(response, { status: 500 });
  }
}
