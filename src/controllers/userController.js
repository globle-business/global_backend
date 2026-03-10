const User = require("../models/UserModel");


// ✅ Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    return res.status(200).json({
      message: "All users fetched successfully",
      totalUsers: users.length,
      users
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};



// ✅ Create User
exports.createUser = async (req, res) => {
  try {
    const { Username, email, password, mobile } = req.body;

    if (!Username || !email || !password || !mobile) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Check existing email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    // Check existing mobile
    const existingMobile = await User.findOne({ mobile });
    if (existingMobile) {
      return res.status(400).json({
        message: "Mobile already exists"
      });
    }

    const newUser = await User.create({
      Username,
      email,
      password,   
      mobile
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        _id: newUser._id,
        Username: newUser.Username,
        email: newUser.email,
        mobile: newUser.mobile
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};



// ✅ Get Single User
exports.getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      user
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};



// ✅ Update User
exports.updateUser = async (req, res) => {
  try {
    const { Username, email, mobile } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { Username, email, mobile },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};



// ✅ Delete User
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      message: "User deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

// ✅ Activate / Deactivate User
exports.toggleUserStatus = async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Toggle status
    user.status = user.status === "Active" ? "Inactive" : "Active";

    await user.save();

    return res.status(200).json({
      message: `User ${user.status === "Active" ? "Activated" : "Deactivated"} successfully`,
      status: user.status
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};











// ✅ Change Password (Without bcrypt)
exports.changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        message: "New password is required"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { password: newPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      message: "Password updated successfully"
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};