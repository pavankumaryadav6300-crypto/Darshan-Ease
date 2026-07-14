import Temple from '../models/Temple.js';

// @desc    Get all temples (with search filtering)
// @route   GET /api/temples
// @access  Public
export const getTemples = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
          { deity: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const temples = await Temple.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: temples.length,
      data: temples,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single temple by ID
// @route   GET /api/temples/:id
// @access  Public
export const getTempleById = async (req, res, next) => {
  try {
    const temple = await Temple.findById(req.params.id);

    if (!temple) {
      res.status(404);
      throw new Error(`Temple not found with id of ${req.params.id}`);
    }

    res.json({
      success: true,
      data: temple,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new temple
// @route   POST /api/temples
// @access  Private (ADMIN, ORGANIZER)
export const createTemple = async (req, res, next) => {
  try {
    const { name, deity, location, description, timings, image } = req.body;

    const temple = await Temple.create({
      name,
      deity,
      location,
      description,
      timings,
      image,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: temple,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update temple details
// @route   PUT /api/temples/:id
// @access  Private (ADMIN, ORGANIZER)
export const updateTemple = async (req, res, next) => {
  try {
    let temple = await Temple.findById(req.params.id);

    if (!temple) {
      res.status(404);
      throw new Error(`Temple not found with id of ${req.params.id}`);
    }

    // Make sure user is admin or the organizer who created it
    if (req.user.role !== 'ADMIN' && temple.createdBy.toString() !== req.user.id) {
      res.status(403);
      throw new Error(`User is not authorized to update this temple`);
    }

    temple = await Temple.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: temple,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete temple
// @route   DELETE /api/temples/:id
// @access  Private (ADMIN)
export const deleteTemple = async (req, res, next) => {
  try {
    const temple = await Temple.findById(req.params.id);

    if (!temple) {
      res.status(404);
      throw new Error(`Temple not found with id of ${req.params.id}`);
    }

    if (req.user.role !== 'ADMIN') {
      res.status(403);
      throw new Error(`User is not authorized to delete this temple`);
    }

    await temple.deleteOne();

    res.json({
      success: true,
      message: 'Temple deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
