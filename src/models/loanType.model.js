const mongoose = require("mongoose");

const loanTypeSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ["personal", "home", "car", "business"]
  },

  isActive: {
    type: Boolean,
    default: true
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("LoanType", loanTypeSchema);