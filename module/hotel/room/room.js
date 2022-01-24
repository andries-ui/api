const mongoose = require("mongoose");

const roomSchema = mongoose.Schema({

  type: {
    type: String,
    require: true,
  },
  price: {
    type: String,
    require: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: false
  },
  floor: {
    type: String,
    required: true,
  },
  roomNumber: {
    type: String,
    required: true,
    uniquue:true
  },
  hotelId: {
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

const Room = mongoose.model('rooms', roomSchema);
module.exports = Room;