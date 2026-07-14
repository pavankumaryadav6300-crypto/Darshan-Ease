import express from 'express';
import {
  createDonation,
  getMyDonations,
  getAllDonations,
} from '../controllers/donationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validateDonation } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post(
  '/',
  (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      return protect(req, res, next);
    }
    next();
  },
  validateDonation,
  createDonation
);

router.get('/my', protect, getMyDonations);
router.get('/', protect, authorize('ADMIN'), getAllDonations);

export default router;
