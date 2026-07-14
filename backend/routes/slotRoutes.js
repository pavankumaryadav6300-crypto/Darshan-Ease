import express from 'express';
import {
  getSlotsByTemple,
  createSlots,
  deleteSlot,
} from '../controllers/slotController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('ADMIN', 'ORGANIZER'), createSlots);
router.get('/temple/:templeId', getSlotsByTemple);
router.delete('/:id', protect, authorize('ADMIN', 'ORGANIZER'), deleteSlot);

export default router;
