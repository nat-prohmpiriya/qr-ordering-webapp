import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Branch from '@/models/Branch';
import type { ApiResponse } from '@/types';

/**
 * GET /api/branches/:slug
 * Get a single branch by slug
 * Public endpoint - no authentication required
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      const response: ApiResponse = {
        success: false,
        error: 'Branch slug is required',
      };
      return NextResponse.json(response, { status: 400 });
    }

    await connectDB();

    const branch = await Branch.findOne({ slug, isActive: true })
      .select('-__v')
      .lean();

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
    console.error('Error fetching branch:', error);

    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch branch',
    };

    return NextResponse.json(response, { status: 500 });
  }
}
