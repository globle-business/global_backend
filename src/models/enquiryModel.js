const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    // 🔹 Basic Info
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      index: true
    },
    mobileNumber: {
      type: String,
      required: true
    },

    // 🔹 Location
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },

    // 🔹 Loan Info
    loanType: {
      type: String,
      enum: ["personal", "home", "car", "business"],
      required: true
    },
    loanAmount: {
      type: Number,
      required: true
    },
    employmentStatus: {
      type: String,
      enum: ["employed", "self-employed", "unemployed"],
      required: true
    },

    // 🔹 CRM Fields (Admin Side)
    enquiryStatus: {
      type: String,
      enum: ["new", "in-progress", "approved", "rejected"],
      default: "new"
    },
    priorityLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    followUpDate: Date,
    notes: String,
    riskScore: Number,

    // 🔹 Soft Delete
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enquiry", enquirySchema);