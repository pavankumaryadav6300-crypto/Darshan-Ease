import express from 'express';
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  cancelBooking,
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validateBooking } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.use(protect); // Secure all booking routes

router.route('/')
  .post(validateBooking, createBooking)
  .get(authorize('ADMIN', 'ORGANIZER'), getAllBookings);

router.get('/my', getMyBookings);
router.put('/:id/cancel', cancelBooking);

export default router;
