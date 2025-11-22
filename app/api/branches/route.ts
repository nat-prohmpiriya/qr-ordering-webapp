import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Branch from '@/models/Branch';
import type { ApiResponse } from '@/types';

/**
 * GET /api/branches
 * List all active branches
 * Public endpoint - no authentication required
 */
export async function GET() {
  try {
    await connectDB();

    const branches = await Branch.find({ isActive: true })
      .select('-__v')
      .sort({ name: 1 })
      .lean();

    const response: ApiResponse = {
      success: true,
      data: branches,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching branches:', error);

    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch branches',
    };

    return NextResponse.json(response, { status: 500 });
  }
}
