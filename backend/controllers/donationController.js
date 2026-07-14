import Donation from '../models/Donation.js';
import Temple from '../models/Temple.js';

// @desc    Create a new donation
// @route   POST /api/donations
// @access  Public (Optionally authenticated)
export const createDonation = async (req, res, next) => {
  try {
    const { templeId, amount, devoteeName, purpose } = req.body;

    if (!templeId || !amount || !devoteeName) {
      res.status(400);
      throw new Error('Please provide templeId, amount, and devoteeName');
    }

    const temple = await Temple.findById(templeId);
    if (!temple) {
      res.status(404);
      throw new Error(`Temple not found with id of ${templeId}`);
    }

    // Prepare donation data
    const donationData = {
      temple: templeId,
      amount,
      devoteeName,
      purpose: purpose || 'General Donation',
      paymentStatus: 'Completed', // Mock payment integration success
    };

    // If request contains authorization, link user
    if (req.user) {
      donationData.user = req.user.id;
    }

    const donation = await Donation.create(donationData);

    res.status(201).json({
      success: true,
      data: donation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's donations
// @route   GET /api/donations/my
// @access  Private
export const getMyDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find({ user: req.user.id })
      .populate('temple')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all donations (Admin)
// @route   GET /api/donations
// @access  Private (ADMIN)
export const getAllDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find({})
      .populate('user', 'name email')
      .populate('temple')
      .sort({ createdAt: -1 });

    // Calculate total amount collected
    const totalAmount = donations.reduce((sum, donation) => sum + donation.amount, 0);

    res.json({
      success: true,
      count: donations.length,
      totalAmount,
      data: donations,
    });
  } catch (error) {
    next(error);
  }
};
