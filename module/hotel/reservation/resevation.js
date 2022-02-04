const mongoose = require("mongoose");

const reservationSchema = mongoose.Schema({

  guestId: {
    type: String,
  },
  hotelId: {
    type: String,
  },
  roomId: {
    type: String,
  },
  transportation: {
    type: Boolean,
  },
  checkinDate: {
    type: String,
  },
  checkoutDate: {
    type: String,
  },
  adults: {
    type: String,
  },
  children: {
    type: String,
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
  },
});

const RoomReservation = mongoose.model("roomReservations", reservationSchema);
module.exports = RoomReservation;