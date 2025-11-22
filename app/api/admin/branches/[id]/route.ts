import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Branch from '@/models/Branch';
import type { ApiResponse } from '@/types';

// PUT - Update branch (Owner only)
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

    await connectDB();

    const body = await request.json();
    const { name, slug, address, phone, email, openingHours, isActive } = body;

    const branch = await Branch.findById(id);

    if (!branch) {
      const response: ApiResponse = {
        success: false,
        error: 'Branch not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Check if slug is being changed and if it already exists
    if (slug && slug !== branch.slug) {
      const existingBranch = await Branch.findOne({
        slug,
        _id: { $ne: id },
      });

      if (existingBranch) {
        const response: ApiResponse = {
          success: false,
          error: 'Slug already exists',
        };
        return NextResponse.json(response, { status: 400 });
      }
    }

    // Update branch
    if (name !== undefined) branch.name = name;
    if (slug !== undefined) branch.slug = slug;
    if (address !== undefined) branch.address = address;
    if (phone !== undefined) branch.phone = phone;
    if (email !== undefined) branch.email = email;
    if (openingHours !== undefined) branch.openingHours = openingHours;
    if (isActive !== undefined) branch.isActive = isActive;

    await branch.save();

    const response: ApiResponse = {
      success: true,
      data: branch,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Error updating branch:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to update branch',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// DELETE - Delete branch (Owner only)
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

    await connectDB();

    const branch = await Branch.findByIdAndDelete(id);

    if (!branch) {
      const response: ApiResponse = {
        success: false,
        error: 'Branch not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      data: { message: 'Branch deleted successfully' },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting branch:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to delete branch',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
