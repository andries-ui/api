const mongoose = require("mongoose");

const userShema = mongoose.Schema({
 
  username: {
    type: String,
    required: true,
  },
   password: {
    type: String,
    required: true,
  },
  names: {
    type: String,
    required: true,
  },
   url: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  
   contact: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
  deletedAt: {
    type: Date,
    default: null,
  },
});

const User = mongoose.model("users", userShema);

module.exports =  User;
