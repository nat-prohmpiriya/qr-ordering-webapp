import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Branch from '@/models/Branch';
import type { ApiResponse } from '@/types';
import mongoose from 'mongoose';

/**
 * GET /api/branches/:id
 * Get a single branch by ID or slug
 * Public endpoint - no authentication required
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      const response: ApiResponse = {
        success: false,
        error: 'Branch identifier is required',
      };
      return NextResponse.json(response, { status: 400 });
    }

    let branch;

    // Check if id is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      branch = await Branch.findById(id).select('-__v').lean();
    }

    // If not found by ID or not a valid ObjectId, try to find by slug
    if (!branch) {
      branch = await Branch.findOne({ slug: id }).select('-__v').lean();
    }

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
