const mongoose = require("mongoose");

const adminNotifications = mongoose.Schema({

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

const AdminNotifications = mongoose.model("adminNotifications", adminNotifications);
module.exports = AdminNotifications;