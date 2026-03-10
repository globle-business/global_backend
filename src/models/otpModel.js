const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    sendBy: {
      type: String, // email
      required: true
    },
    otp: {
      type: String,
      required: true
    },
  createdAt: {
  type: Date,
  default: Date.now
}
  }
);

module.exports = mongoose.model("Otp", otpSchema);