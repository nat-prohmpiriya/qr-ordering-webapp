import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  // Socket.io will be initialized in server.ts
  // This route is just a placeholder for the Socket.io path
  return new Response('Socket.IO server', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
