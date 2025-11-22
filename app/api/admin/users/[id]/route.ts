import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import type { ApiResponse } from '@/types';

// PUT - Update user (Owner only)
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
    const { name, email, password, role, branchId, isActive } = body;

    const user = await User.findById(id);

    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: 'User not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: id },
      });

      if (existingUser) {
        const response: ApiResponse = {
          success: false,
          error: 'Email already exists',
        };
        return NextResponse.json(response, { status: 400 });
      }
    }

    // Validate role if being changed
    if (role && !['owner', 'staff'].includes(role)) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid role. Must be either "owner" or "staff"',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Staff must have branchId
    const finalRole = role || user.role;
    if (finalRole === 'staff' && !branchId && !user.branchId) {
      const response: ApiResponse = {
        success: false,
        error: 'Staff users must be assigned to a branch',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Update user
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (role !== undefined) {
      user.role = role;
      // Clear branchId if changing from staff to owner
      if (role === 'owner') {
        user.branchId = undefined;
      }
    }
    if (branchId !== undefined) user.branchId = branchId;
    if (isActive !== undefined) user.isActive = isActive;

    // Update password if provided
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    // Return user without password
    const updatedUser = await User.findById(id)
      .select('-password -__v')
      .populate('branchId', 'name slug')
      .lean();

    const response: ApiResponse = {
      success: true,
      data: updatedUser,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Error updating user:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to update user',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// DELETE - Delete user (Owner only)
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

    // Prevent deleting yourself
    if (session.user.id === id) {
      const response: ApiResponse = {
        success: false,
        error: 'Cannot delete your own account',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: 'User not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      data: { message: 'User deleted successfully' },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to delete user',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
