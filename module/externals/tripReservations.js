const mongoose = require('mongoose');

const tripReservationsSchema = mongoose.Schema({

  driverId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    require: true,
  },
  pickupDate: {
    type: String,
    require: true,
  },
  pickupAddress: {
    type: String,
    require: true,
  },
  city: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: true
  },
  country: {
    type: String,
    required: true,
  },
  latitude: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
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