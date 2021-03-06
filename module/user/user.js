const mongoose = require("mongoose");

const userShema = mongoose.Schema({
 
  username: {
    type: String,
    required: true
  },
   password: {
    type: String,
    required: true
  },
  names: {
    type: String,
    required: true
  },
   url: {
    data: Buffer,
    contentType: String
  },
  email: {
    type: String,
    required: true
  },
  
   contact: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
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

const User = mongoose.model("users", userShema);

module.exports =  User;
