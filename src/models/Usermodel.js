const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    Username: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    mobile: {
      type: String,
      required: true,
      unique: true
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user"
    },
    lastLogin: {
      type: Date,
      default: null
    },


    isemailverified: {
      type: Boolean,
      default: false
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active"
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);