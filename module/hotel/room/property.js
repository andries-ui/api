const mongoose = require("mongoose");

const propertySchema = mongoose.Schema({

  bedtype: {
    type: String,
    require: true,
  },
  tv: {
    type: String,
    require: true,
  },
  wifi: {
    type: String,
    require: true,
  },
  parking: {
    type: String,
    require: true,
  },
  numberOfBed: {
    type: String,
    require: true,
  },
  desc: {
    contentType: String,
    required: true,
  },
  roomId: {
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

const Property = mongoose.model('properties', propertySchema);
module.exports = Property;