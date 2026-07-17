import Booking from '../models/Booking.js';
import DarshanSlot from '../models/DarshanSlot.js';
import Temple from '../models/Temple.js';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (USER, ORGANIZER, ADMIN)
export const createBooking = async (req, res, next) => {
  try {
    const { templeId, slotId, devotees, paymentMethod, prasadams } = req.body;

    if (!templeId || !slotId || !devotees || devotees.length === 0) {
      res.status(400);
      throw new Error('Please provide templeId, slotId, and at least one devotee details');
    }

    const devoteeCount = devotees.length;

    // ATOMIC UPDATE: decrement available slots only if there are enough slots available
    const slot = await DarshanSlot.findOneAndUpdate(
      {
        _id: slotId,
        temple: templeId,
        availableSlots: { $gte: devoteeCount },
      },
      {
        $inc: { availableSlots: -devoteeCount },
      },
      { new: true }
    );

    if (!slot) {
      res.status(400);
      throw new Error('Selected slot is full or unavailable for the requested number of devotees');
    }

    const parsedPrasadams = parseInt(prasadams) || 0;
    const totalPrice = (slot.price * devoteeCount) + (parsedPrasadams * 50); // ₹50 per prasadam

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      temple: templeId,
      slot: slotId,
      devotees,
      totalPrice,
      paymentMethod: paymentMethod || 'UPI',
      prasadams: parsedPrasadams,
      status: 'Booked',
    });

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/my
// @access  Private
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('temple')
      .populate('slot')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin/Organizer)
// @route   GET /api/bookings
// @access  Private (ADMIN, ORGANIZER)
export const getAllBookings = async (req, res, next) => {
  try {
    let query = {};

    // If Organizer, filter bookings to only temples they created
    if (req.user.role === 'ORGANIZER') {
      const temples = await Temple.find({ createdBy: req.user.id });
      const templeIds = temples.map((t) => t._id);
      query = { temple: { $in: templeIds } };
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name email')
      .populate('temple')
      .populate('slot')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error(`Booking not found with id of ${req.params.id}`);
    }

    // Verify authorized: user who booked, or Admin, or Temple Organizer
    const temple = await Temple.findById(booking.temple);
    const isTempleOrganizer = temple && temple.createdBy.toString() === req.user.id;

    if (
      booking.user.toString() !== req.user.id &&
      req.user.role !== 'ADMIN' &&
      !isTempleOrganizer
    ) {
      res.status(403);
      throw new Error('Not authorized to cancel this booking');
    }

    if (booking.status === 'Cancelled') {
      res.status(400);
      throw new Error('Booking is already cancelled');
    }

    // Rollback atomic update: Increment slot availability back
    const devoteeCount = booking.devotees.length;
    await DarshanSlot.findByIdAndUpdate(booking.slot, {
      $inc: { availableSlots: devoteeCount },
    });

    // Update booking status
    booking.status = 'Cancelled';
    await booking.save();

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};
