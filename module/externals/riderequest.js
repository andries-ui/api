const mongoose = require("mongoose");

const RideRequestShema = mongoose.Schema({
 
  distance: {
    type: String,
    required: true
  },
  pickupAddress: {
    type: String,
    required: true
  },
  hotelId: {
    type: String,
    required: true
  },
   price: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  driverId: {
    type: String,
    required: true
  },
  clientId: {
    type: String,
    required: true
  },
  createdAt: {
    type: String
  },
  updatedAt: {
    type: String
  },
  deletedAt: {
    type: String
  },
});

const RideRequest = mongoose.model("riderequests", RideRequestShema);

module.exports =  RideRequest;
