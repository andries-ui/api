const mongoose = require("mongoose");

const reservationSchema = mongoose.Schema({

  guestId: {
    type: String,
    require: true,
  },
  hotelId: {
    type: String,
    require: true,
  },
  roomId: {
    type: String,
    require: true,
  },
  transportation: {
    type: Boolean,
    require: true,
  },
  checkinDate: {
    type: Date,
    require: true,
  },
  checkoutDate: {
    type: Date,
    require: true,
  },
  adults: {
    type: String,
    required: true,
  },
  children: {
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

const RoomReservation = mongoose.model("roomReservations", reservationSchema);
module.exports = RoomReservation;