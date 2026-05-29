/**
 * RamSeetha Game Server
 * Main server file with Express and Socket.IO configuration
 */

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeGameSocket } from './socket/gameSocket.js';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);

// ============= CONFIGURATION =============

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// ============= MIDDLEWARE =============

// Enable CORS for Express
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

// JSON body parser
app.use(express.json());

// ============= SOCKET.IO CONFIGURATION =============

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST'],
  },
  // Socket.IO performance optimizations
  transports: ['websocket', 'polling'],
});

// Initialize game socket events
initializeGameSocket(io);

// ============= REST API ENDPOINTS =============

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  });
});

/**
 * Get server info
 */
app.get('/api/info', (req, res) => {
  res.json({
    name: 'RamSeetha Game Server',
    version: '1.0.0',
    environment: NODE_ENV,
  });
});

// ============= ERROR HANDLING =============

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
  });
});

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: NODE_ENV === 'development' ? err.message : 'An error occurred',
  });
});

// ============= SERVER STARTUP =============

httpServer.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════╗
║    🎮 RamSeetha Game Server 🎮    ║
╠════════════════════════════════════╣
║ Server running at: http://localhost:${PORT}      
║ Environment: ${NODE_ENV}
║ Client URL: ${CLIENT_URL}
╚════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export { io };
