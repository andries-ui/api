const mongoose = require("mongoose");

const roomSchema = mongoose.Schema({

  type: {
    type: String,
  },
  price: {
    type: String,
  },
  status: {
    type: Boolean,
    default: false
  },
  floor: {
    type: String,
  },
  roomNumber: {
    type: String,
    unique:true
  },
  hotelId: {
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
    default: null,
  },
});

const Room = mongoose.model('rooms', roomSchema);
module.exports = Room;