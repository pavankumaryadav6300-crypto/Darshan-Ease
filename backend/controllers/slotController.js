import DarshanSlot from '../models/DarshanSlot.js';
import Temple from '../models/Temple.js';

// @desc    Get slots for a temple by date
// @route   GET /api/slots/temple/:templeId
// @access  Public
export const getSlotsByTemple = async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) {
      res.status(400);
      throw new Error('Please provide a date query parameter (YYYY-MM-DD)');
    }

    const slots = await DarshanSlot.find({
      temple: req.params.templeId,
      date,
    });

    res.json({
      success: true,
      count: slots.length,
      data: slots,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a slot batch
// @route   POST /api/slots
// @access  Private (ADMIN, ORGANIZER)
export const createSlots = async (req, res, next) => {
  try {
    const { templeId, date, timeSlots, capacity, price, type } = req.body;

    if (!templeId || !date || !timeSlots || !capacity) {
      res.status(400);
      throw new Error('Please fill all required slot fields (templeId, date, timeSlots, capacity)');
    }

    const temple = await Temple.findById(templeId);
    if (!temple) {
      res.status(404);
      throw new Error(`Temple not found with id of ${templeId}`);
    }

    // Verify user is authorized (Admin or the temple creator/organizer)
    if (req.user.role !== 'ADMIN' && temple.createdBy.toString() !== req.user.id) {
      res.status(403);
      throw new Error('User is not authorized to add slots for this temple');
    }

    const createdSlots = [];

    // loop and insert slots
    for (const timeSlot of timeSlots) {
      try {
        const slot = await DarshanSlot.create({
          temple: templeId,
          date,
          timeSlot,
          capacity,
          availableSlots: capacity,
          price: price || 0,
          type: type || 'General',
        });
        createdSlots.push(slot);
      } catch (err) {
        // Log duplicate error but don't break the script, just skip duplicate slots
        console.log(`Slot already exists: ${timeSlot} on ${date}`);
      }
    }

    res.status(201).json({
      success: true,
      count: createdSlots.length,
      data: createdSlots,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a specific slot
// @route   DELETE /api/slots/:id
// @access  Private (ADMIN, ORGANIZER)
export const deleteSlot = async (req, res, next) => {
  try {
    const slot = await DarshanSlot.findById(req.params.id);

    if (!slot) {
      res.status(404);
      throw new Error(`Slot not found with id of ${req.params.id}`);
    }

    const temple = await Temple.findById(slot.temple);

    // Verify authorized
    if (req.user.role !== 'ADMIN' && (!temple || temple.createdBy.toString() !== req.user.id)) {
      res.status(403);
      throw new Error('User is not authorized to delete slots for this temple');
    }

    await slot.deleteOne();

    res.json({
      success: true,
      message: 'Slot deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
