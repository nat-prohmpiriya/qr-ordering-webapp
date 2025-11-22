import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import MenuItem from '@/models/MenuItem';
import Branch from '@/models/Branch';
import type { ApiResponse } from '@/types';

/**
 * GET /api/menu
 * Get menu items with optional filtering
 * Query params:
 *   - branchId: Filter by branch (returns only items available at that branch)
 *   - categoryId: Filter by category
 *   - isVegetarian: Filter vegetarian items (true/false)
 * Public endpoint - no authentication required
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');
    const categoryId = searchParams.get('categoryId');
    const isVegetarian = searchParams.get('isVegetarian');

    await connectDB();

    // Build query for MenuItem
    const query: any = { isAvailable: true };

    if (categoryId) {
      query.categoryId = categoryId;
    }

    if (isVegetarian === 'true') {
      query.isVegetarian = true;
    }

    // If branchId is provided, filter by branch availability
    let menuItems;
    if (branchId) {
      // Get branch and its menu items
      const branch = await Branch.findById(branchId).select('menuItems').lean();

      if (!branch) {
        const response: ApiResponse = {
          success: false,
          error: 'Branch not found',
        };
        return NextResponse.json(response, { status: 404 });
      }

      // Filter menu items by branch's menuItems array
      if (branch.menuItems && branch.menuItems.length > 0) {
        query._id = { $in: branch.menuItems };
      } else {
        // If branch has no menu items assigned, return empty array
        query._id = { $in: [] };
      }

      menuItems = await MenuItem.find(query)
        .populate('categoryId', 'name slug')
        .select('-__v')
        .sort({ categoryId: 1 })
        .lean();
    } else {
      // Return all available menu items
      menuItems = await MenuItem.find(query)
        .populate('categoryId', 'name slug')
        .select('-__v')
        .sort({ categoryId: 1 })
        .lean();
    }

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
