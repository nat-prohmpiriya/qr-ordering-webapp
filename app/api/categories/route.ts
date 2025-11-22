import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import type { ApiResponse } from '@/types';

/**
 * GET /api/categories
 * Get all active categories sorted by displayOrder
 * Public endpoint - no authentication required
 */
export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find({ isActive: true })
      .select('-__v')
      .sort({ displayOrder: 1 })
      .lean();

    const response: ApiResponse = {
      success: true,
      data: categories,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching categories:', error);

    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch categories',
    };

    return NextResponse.json(response, { status: 500 });
  }
}
