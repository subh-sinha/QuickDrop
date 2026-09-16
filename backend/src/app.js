import express from 'express';
import cors from 'cors';
import fileRoutes from './routes/file.routes.js';
import { connectDB } from "./db/db.js";

const app = express();

connectDB();

// Enable CORS for cross-origin requests
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    success: true,
    message: 'QuickDrop API Backend is running smoothly!',
    timestamp: new Date().toISOString()
  });
});

// Mount API routes (supports both /api/v1 and /api/v1/files prefixes)
app.use("/api/v1", fileRoutes);
app.use("/api/v1/files", fileRoutes);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("Backend Error:", err);
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: 'File size exceeds the 2 MB limit.',
      data: null
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    statusCode,
    success: false,
    message,
    data: null
  });
});

export default app;