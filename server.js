const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3600', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Initialize Socket.io
  const io = new Server(httpServer, {
    path: '/api/socketio',
    addTrailingSlash: false,
    cors: {
      origin: process.env.NEXTAUTH_URL || `http://localhost:${port}`,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('✅ Client connected:', socket.id);

    // Join branch room for real-time updates
    socket.on('join-branch', (branchId) => {
      socket.join(`branch:${branchId}`);
      console.log(`📍 Socket ${socket.id} joined branch: ${branchId}`);
    });

    // Leave branch room
    socket.on('leave-branch', (branchId) => {
      socket.leave(`branch:${branchId}`);
      console.log(`📍 Socket ${socket.id} left branch: ${branchId}`);
    });

    // Join order room for tracking
    socket.on('join-order', (orderId) => {
      socket.join(`order:${orderId}`);
      console.log(`📦 Socket ${socket.id} joined order: ${orderId}`);
    });

    // Leave order room
    socket.on('leave-order', (orderId) => {
      socket.leave(`order:${orderId}`);
      console.log(`📦 Socket ${socket.id} left order: ${orderId}`);
    });

    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id);
    });
  });

  // Make io accessible globally
  global.io = io;

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`🚀 Ready on http://${hostname}:${port}`);
      console.log(`🔌 Socket.IO ready on ws://${hostname}:${port}/api/socketio`);
    });
});
