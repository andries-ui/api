const mongoose = require("mongoose");

const locationSchema = mongoose.Schema({
  userid: {
    type: String,
    require: true,
  },
  userType: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  city: {
    type: String,
    required: true,
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
  },
  updatedAt: {
    type: Date,
  },
  deletedAt: {
    type: Date,
  },
});

const location = mongoose.model("locations", locationSchema);

module.exports = location;