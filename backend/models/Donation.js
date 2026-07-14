import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Can be null if anonymous
    },
    temple: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Temple',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please add a donation amount'],
      min: [10, 'Minimum donation amount is ₹10'],
    },
    devoteeName: {
      type: String,
      required: [true, 'Please add the name of the donor/devotee'],
      trim: true,
    },
    purpose: {
      type: String,
      enum: ['Annadanam', 'Temple Development', 'General Donation', 'Pooja/Seva Fund'],
      default: 'General Donation',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Completed',
    },
    donatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Donation = mongoose.model('Donation', donationSchema);

export default Donation;
