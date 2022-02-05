const mongoose = require("mongoose");

const driverNotifications = mongoose.Schema({

  userId: {
    type: String,
  },
  title: {
    type: String,
    require: true,
  },
  message: {
    type: String,
    required: true,
  },
  status:{
    type: Boolean
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
});

const DriverNotifications = mongoose.model("driverNotifications", driverNotifications);
module.exports = DriverNotifications;