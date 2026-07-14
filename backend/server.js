import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorMiddleware.js';

// Load routes
import authRoutes from './routes/authRoutes.js';
import templeRoutes from './routes/templeRoutes.js';
import slotRoutes from './routes/slotRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import donationRoutes from './routes/donationRoutes.js';

// Load env vars
dotenv.config();

// Connect database
connectDB();

const app = express();

// Set security HTTP headers
app.use(helmet());

// Body parser middleware with payload limits
app.use(express.json({ limit: '10kb' }));

// Enable CORS
app.use(cors());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting configurations
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to authentication routes
app.use('/api/auth/login', apiLimiter);
app.use('/api/auth/register', apiLimiter);

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/temples', templeRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/donations', donationRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to DarshanEase Ticket Booking API' });
});

// Centralized error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Unhandled Rejection Error: ${err.message}`);
});
