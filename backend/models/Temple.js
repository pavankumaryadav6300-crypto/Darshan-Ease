import mongoose from 'mongoose';

const templeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a temple name'],
      trim: true,
    },
    deity: {
      type: String,
      required: [true, 'Please add the primary deity name'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    timings: {
      type: String,
      required: [true, 'Please add temple timings (e.g. 6:00 AM - 9:00 PM)'],
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1602693680077-4403f55cd554?auto=format&fit=crop&q=80&w=600',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Temple = mongoose.model('Temple', templeSchema);

export default Temple;
