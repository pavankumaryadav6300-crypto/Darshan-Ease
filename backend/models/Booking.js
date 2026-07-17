import mongoose from 'mongoose';

const devoteeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a devotee name'],
  },
  age: {
    type: Number,
    required: [true, 'Please add devotee age'],
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Please add devotee gender'],
  },
  idProofType: {
    type: String,
    enum: ['Aadhaar Card', 'PAN Card', 'Passport', 'Voter ID'],
    required: [true, 'Please add ID Proof Type'],
  },
  idProofNumber: {
    type: String,
    required: [true, 'Please add ID Proof Number'],
  },
});

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    temple: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Temple',
      required: true,
    },
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DarshanSlot',
      required: true,
    },
    devotees: [devoteeSchema],
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Booked', 'Cancelled'],
      default: 'Booked',
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'Credit/Debit Card', 'Net Banking'],
      default: 'UPI',
    },
    prasadams: {
      type: Number,
      default: 0,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
