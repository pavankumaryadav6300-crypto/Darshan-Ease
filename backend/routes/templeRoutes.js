import express from 'express';
import {
  getTemples,
  getTempleById,
  createTemple,
  updateTemple,
  deleteTemple,
} from '../controllers/templeController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(getTemples)
  .post(protect, authorize('ADMIN', 'ORGANIZER'), createTemple);

router
  .route('/:id')
  .get(getTempleById)
  .put(protect, authorize('ADMIN', 'ORGANIZER'), updateTemple)
  .delete(protect, authorize('ADMIN'), deleteTemple);

export default router;
