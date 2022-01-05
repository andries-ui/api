const mongoose = require("mongoose");

const VerificationSchema = mongoose.Schema({
 
  userId: {
    type: String,
    unique: true
  },
   pin: {
    type: Number,
  },
 
  createdAt: {
    type: Date
  },
  expiresAt: {
    type: Date
  },
 
});

const Verification = mongoose.model("verifications", VerificationSchema);

module.exports =  Verification;
