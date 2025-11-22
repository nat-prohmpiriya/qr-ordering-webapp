import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Table from '@/models/Table';
import type { ApiResponse } from '@/types';

// GET - List all tables (with optional branch filter)
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      const response: ApiResponse = {
        success: false,
        error: 'Unauthorized',
      };
      return NextResponse.json(response, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');

    const query: any = {};

    // Staff can only see their branch tables
    if (session.user.role === 'staff' && session.user.branchId) {
      query.branchId = session.user.branchId;
    } else if (branchId) {
      // Owner can filter by branchId
      query.branchId = branchId;
    }

    const tables = await Table.find(query)
      .populate('branchId', 'name slug')
      .sort({ tableNumber: 1 })
      .lean();

    const response: ApiResponse = {
      success: true,
      data: tables,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching tables:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch tables',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// POST - Create new table (Owner only)
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
    const { branchId, tableNumber, zone, capacity, qrCode } = body;

    // Validate required fields
    if (!branchId || !tableNumber || !zone || !capacity) {
      const response: ApiResponse = {
        success: false,
        error: 'Branch, table number, zone, and capacity are required',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Check if table number already exists in this branch
    const existingTable = await Table.findOne({ branchId, tableNumber });
    if (existingTable) {
      const response: ApiResponse = {
        success: false,
        error: 'Table number already exists in this branch',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Generate QR code if not provided
    const finalQrCode = qrCode || `qr_${branchId}_table_${tableNumber}`.toLowerCase().replace(/\s+/g, '_');

    // Check if QR code already exists
    const existingQr = await Table.findOne({ qrCode: finalQrCode });
    if (existingQr) {
      const response: ApiResponse = {
        success: false,
        error: 'QR code already exists',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const table = await Table.create({
      branchId,
      tableNumber,
      zone,
      capacity,
      qrCode: finalQrCode,
      isActive: true,
    });

    const populatedTable = await Table.findById(table._id)
      .populate('branchId', 'name slug')
      .lean();

    const response: ApiResponse = {
      success: true,
      data: populatedTable,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error('Error creating table:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to create table',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
