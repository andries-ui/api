const mongoose = require('mongoose')


const accountSchema = mongoose.Schema({

  blocked: {
    type: Boolean,
    required: true,
    default: false,
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
  warning: {
    type: String,
    required: true,
    default: 0,
  },
  userId: {
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

const Account = mongoose.model("accounts", accountSchema);
module.exports = Account;