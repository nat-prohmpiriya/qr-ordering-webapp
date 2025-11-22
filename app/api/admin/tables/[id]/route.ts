import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Table from '@/models/Table';
import type { ApiResponse } from '@/types';

// GET - Get single table
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      const response: ApiResponse = {
        success: false,
        error: 'Unauthorized',
      };
      return NextResponse.json(response, { status: 401 });
    }

    const { id } = await params;

    await connectDB();

    const table = await Table.findById(id)
      .populate('branchId', 'name slug')
      .lean();

    if (!table) {
      const response: ApiResponse = {
        success: false,
        error: 'Table not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Staff can only view their branch tables
    if (
      session.user.role === 'staff' &&
      session.user.branchId &&
      table.branchId._id.toString() !== session.user.branchId.toString()
    ) {
      const response: ApiResponse = {
        success: false,
        error: 'Unauthorized - Cannot view tables from other branches',
      };
      return NextResponse.json(response, { status: 403 });
    }

    const response: ApiResponse = {
      success: true,
      data: table,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching table:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch table',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// PUT - Update table (Owner only)
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
    const { tableNumber, zone, capacity, isActive, qrCode } = body;

    const table = await Table.findById(id);

    if (!table) {
      const response: ApiResponse = {
        success: false,
        error: 'Table not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Check if table number is being changed and if it already exists
    if (tableNumber && tableNumber !== table.tableNumber) {
      const existingTable = await Table.findOne({
        branchId: table.branchId,
        tableNumber,
        _id: { $ne: id },
      });

      if (existingTable) {
        const response: ApiResponse = {
          success: false,
          error: 'Table number already exists in this branch',
        };
        return NextResponse.json(response, { status: 400 });
      }
    }

    // Check if QR code is being changed and if it already exists
    if (qrCode && qrCode !== table.qrCode) {
      const existingQr = await Table.findOne({
        qrCode,
        _id: { $ne: id },
      });

      if (existingQr) {
        const response: ApiResponse = {
          success: false,
          error: 'QR code already exists',
        };
        return NextResponse.json(response, { status: 400 });
      }
    }

    // Update table
    if (tableNumber !== undefined) table.tableNumber = tableNumber;
    if (zone !== undefined) table.zone = zone;
    if (capacity !== undefined) table.capacity = capacity;
    if (isActive !== undefined) table.isActive = isActive;
    if (qrCode !== undefined) table.qrCode = qrCode;

    await table.save();

    const updatedTable = await Table.findById(id)
      .populate('branchId', 'name slug')
      .lean();

    const response: ApiResponse = {
      success: true,
      data: updatedTable,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Error updating table:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to update table',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// DELETE - Delete table (Owner only)
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

    const table = await Table.findByIdAndDelete(id);

    if (!table) {
      const response: ApiResponse = {
        success: false,
        error: 'Table not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      data: { message: 'Table deleted successfully' },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting table:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to delete table',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
