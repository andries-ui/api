const mongoose = require("mongoose");

const hotelSchema = mongoose.Schema({

  name: {
    type: String,
    require: true,
  },
  url: {
    data: Buffer,
    contentType: String
  },
  taxNumber: {
    type: String,
    require: true,
  },
  contact: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  verified: {
    type: Boolean,
  },
  companyId: {
    type: String,
    require: true,
  },
  managerId: {
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

const Hotel = mongoose.model("hotels", hotelSchema);
module.exports = Hotel;