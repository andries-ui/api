const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({

  guestId: {
    type: String,
    require: true,
  },
  reservationId: {
    type: String,
    require: true,
  },
  amount: {
    type: String,
    require: true,
  },
  paymentMethod: {
    type: String,
    require: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model("payments", paymentSchema);
module.exports = Payment;