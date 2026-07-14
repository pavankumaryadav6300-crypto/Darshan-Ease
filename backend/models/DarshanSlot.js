import mongoose from 'mongoose';

const darshanSlotSchema = new mongoose.Schema(
  {
    temple: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Temple',
      required: true,
    },
    date: {
      type: String, // Store as YYYY-MM-DD for easier querying
      required: [true, 'Please add a date'],
    },
    timeSlot: {
      type: String, // e.g. "09:00 AM - 10:00 AM"
      required: [true, 'Please add a time slot'],
    },
    capacity: {
      type: Number,
      required: [true, 'Please add total slot capacity'],
    },
    availableSlots: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      default: 0, // 0 means free darshan
    },
    type: {
      type: String,
      enum: ['General', 'VIP', 'Special Pooja'],
      default: 'General',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure slot combination is unique for a temple on a given date and time and type
darshanSlotSchema.index({ temple: 1, date: 1, timeSlot: 1, type: 1 }, { unique: true });

const DarshanSlot = mongoose.model('DarshanSlot', darshanSlotSchema);

export default DarshanSlot;
