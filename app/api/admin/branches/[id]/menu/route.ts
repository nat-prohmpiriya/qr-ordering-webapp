import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Branch from '@/models/Branch';
import MenuItem from '@/models/MenuItem';
import type { ApiResponse } from '@/types';

export async function PUT(
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

    // Only owners can manage branch menus
    if (session.user.role !== 'owner') {
      const response: ApiResponse = {
        success: false,
        error: 'Forbidden: Only owners can manage branch menus',
      };
      return NextResponse.json(response, { status: 403 });
    }

    await connectDB();

    const resolvedParams = await params;
    const { id } = resolvedParams;

    const body = await request.json();
    const { menuItemIds } = body;

    if (!Array.isArray(menuItemIds)) {
      const response: ApiResponse = {
        success: false,
        error: 'menuItemIds must be an array',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Verify all menu items exist
    const menuItems = await MenuItem.find({
      _id: { $in: menuItemIds },
    });

    if (menuItems.length !== menuItemIds.length) {
      const response: ApiResponse = {
        success: false,
        error: 'Some menu items do not exist',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Update branch with menu items
    const branch = await Branch.findByIdAndUpdate(
      id,
      { menuItems: menuItemIds },
      { new: true, runValidators: true }
    );

    if (!branch) {
      const response: ApiResponse = {
        success: false,
        error: 'Branch not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      data: branch,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Error updating branch menu:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to update branch menu',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
