import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  // Debug: Show full env var (temporarily)
  const fullUri = process.env.MONGODB_URI || 'UNDEFINED';
  console.log('Full MONGODB_URI:', fullUri);

  try {
    await connectDB();
    return NextResponse.json({
      success: true,
      message: 'MongoDB connected successfully',
      uri: fullUri.substring(0, 30) + '...'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      uri: fullUri.substring(0, 30) + '...',
      fullUriFirst50: fullUri.substring(0, 50)
    }, { status: 500 });
  }
}
