import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Table from '@/models/Table';
import Branch from '@/models/Branch';
import type { ApiResponse } from '@/types';

/**
 * GET /api/tables/:qrCode
 * Get table information by QR code
 * Also returns branch information
 * Public endpoint - no authentication required
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ qrCode: string }> }
) {
  try {
    const { qrCode } = await params;

    if (!qrCode) {
      const response: ApiResponse = {
        success: false,
        error: 'QR code is required',
      };
      return NextResponse.json(response, { status: 400 });
    }

    await connectDB();

    // Find table by QR code
    const table = await Table.findOne({ qrCode, isActive: true })
      .select('-__v')
      .lean();

    if (!table) {
      const response: ApiResponse = {
        success: false,
        error: 'Table not found or inactive',
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Get branch information
    const branch = await Branch.findOne({
      _id: table.branchId,
      isActive: true,
    })
      .select('-__v')
      .lean();

    if (!branch) {
      const response: ApiResponse = {
        success: false,
        error: 'Branch not found or inactive',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      data: {
        table,
        branch,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching table:', error);

    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch table information',
    };

    return NextResponse.json(response, { status: 500 });
  }
}
