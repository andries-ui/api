const mongoose = require("mongoose");

const userNotifications = mongoose.Schema({

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

const UserNotifications = mongoose.model("userNotifications", userNotifications);
module.exports = UserNotifications;