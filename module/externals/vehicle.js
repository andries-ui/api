const mongoose = require('mongoose');

const vehicleSchema = mongoose.Schema({
 
  url: {
    type: String,
    required: true,
  },
  driverId: {
    type: String,
    require: true,
  },
  vehicleName: {
    type: String,
    require: true,
  },
  vehiclePlate: {
    type: String,
    require: true,
    unique: true,
  },
  vehicleModel: {
    type: String,
    require: true,
  },
  yearReleased: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    require: true,
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

const Vehicle = mongoose.model("vehicles", vehicleSchema);
module.exports = Vehicle;
