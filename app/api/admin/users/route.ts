import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import type { ApiResponse } from '@/types';

// GET - List all users (Owner only)
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

    const users = await User.find()
      .select('-password -__v')
      .populate('branchId', 'name slug')
      .sort({ createdAt: -1 })
      .lean();

    const response: ApiResponse = {
      success: true,
      data: users,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch users',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// POST - Create new user (Owner only)
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
    const { name, email, password, role, branchId, isActive } = body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      const response: ApiResponse = {
        success: false,
        error: 'Name, email, password, and role are required',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Validate role
    if (!['owner', 'staff'].includes(role)) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid role. Must be either "owner" or "staff"',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Staff must have branchId
    if (role === 'staff' && !branchId) {
      const response: ApiResponse = {
        success: false,
        error: 'Staff users must be assigned to a branch',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const response: ApiResponse = {
        success: false,
        error: 'Email already exists',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      branchId: role === 'staff' ? branchId : undefined,
      isActive: isActive !== undefined ? isActive : true,
    });

    // Return user without password
    const userResponse = await User.findById(user._id)
      .select('-password -__v')
      .populate('branchId', 'name slug')
      .lean();

    const response: ApiResponse = {
      success: true,
      data: userResponse,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to create user',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
