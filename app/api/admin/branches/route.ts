import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Branch from '@/models/Branch';
import type { ApiResponse } from '@/types';

// GET - List all branches (Owner only)
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

    await connectDB();

    const branches = await Branch.find()
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

// POST - Create new branch (Owner only)
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

    await connectDB();

    const body = await request.json();
    const { name, slug, address, phone, email, openingHours, isActive } = body;

    // Validate required fields
    if (!name || !slug || !address || !phone) {
      const response: ApiResponse = {
        success: false,
        error: 'Name, slug, address, and phone are required',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Check if slug already exists
    const existingBranch = await Branch.findOne({ slug });
    if (existingBranch) {
      const response: ApiResponse = {
        success: false,
        error: 'Slug already exists',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const branch = await Branch.create({
      name,
      slug,
      address,
      phone,
      email: email || undefined,
      openingHours: openingHours || undefined,
      isActive: isActive !== undefined ? isActive : true,
    });

    const response: ApiResponse = {
      success: true,
      data: branch,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error('Error creating branch:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to create branch',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
