const mongoose = require('mongoose');

const tripReservationsSchema = mongoose.Schema({

  driverId: {
    type: String,
  },
  userId: {
    type: String,
  },
  vehicleId: {
    type: String,
  },
  pickupDate: {
    type: String,
  },
  pickupAddress: {
    type: String,
  },
  status: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
});

const Reservation = mongoose.model("tripReservations", tripReservationsSchema);
module.exports = Reservation;