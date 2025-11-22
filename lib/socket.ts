import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer | null = null;

export function initSocketServer(httpServer: HTTPServer) {
  if (io) {
    return io;
  }

  io = new SocketIOServer(httpServer, {
    path: '/api/socketio',
    addTrailingSlash: false,
    cors: {
      origin: process.env.NEXTAUTH_URL || 'http://localhost:3600',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join branch room for real-time updates
    socket.on('join-branch', (branchId: string) => {
      socket.join(`branch:${branchId}`);
      console.log(`Socket ${socket.id} joined branch: ${branchId}`);
    });

    // Leave branch room
    socket.on('leave-branch', (branchId: string) => {
      socket.leave(`branch:${branchId}`);
      console.log(`Socket ${socket.id} left branch: ${branchId}`);
    });

    // Join order room for tracking
    socket.on('join-order', (orderId: string) => {
      socket.join(`order:${orderId}`);
      console.log(`Socket ${socket.id} joined order: ${orderId}`);
    });

    // Leave order room
    socket.on('leave-order', (orderId: string) => {
      socket.leave(`order:${orderId}`);
      console.log(`Socket ${socket.id} left order: ${orderId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}

export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}

// Helper functions to emit events
export function emitNewOrder(branchId: string, order: any) {
  if (io) {
    io.to(`branch:${branchId}`).emit('new-order', order);
  }
}

export function emitOrderStatusUpdate(orderId: string, status: string, order: any) {
  if (io) {
    io.to(`order:${orderId}`).emit('order-status-update', { status, order });
  }
}
