const User = require("../models/UserModel");
const Otp = require("../models/otpModel");
const bcrypt = require("bcryptjs");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");

/* ================= GENERATE OTP ================= */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/* ================= SEND OTP ================= */
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const otp = generateOTP();

    await Otp.deleteMany({ sendBy: email });

    const newOtp = await Otp.create({ sendBy: email, otp });

    console.log("Saved OTP Document:", newOtp);

    res.status(200).json({ message: "OTP sent successfully" });

    

  } catch (err) {
  
  }
};

/* ================= VERIFY OTP ================= */
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpEntry = await Otp.findOne({ sendBy: email, otp });

    if (!otpEntry) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await Otp.deleteMany({ sendBy: email });

    res.status(200).json({ message: "OTP verified successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ================= SIGNUP ================= */
exports.signup = async (req, res) => {
  try {
    const { Username, password, email, mobile, role } = req.body;

    const errors = [];

    if (!Username) errors.push("Username is required");
    if (!password) errors.push("Password is required");
    if (!email) errors.push("Email is required");
    if (!mobile) errors.push("Mobile is required");

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Validation error",
        errors
      });
    }

    // email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return res.status(400).json({
        message: "Invalid email format"
      });
    }

    // mobile validation
    const mobilePattern = /^[6-9]\d{9}$/;

    if (!mobilePattern.test(mobile)) {
      return res.status(400).json({
        message: "Invalid mobile number"
      });
    }

    // check email exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists"
      });
    }

    // check mobile exists
    const existingMobile = await User.findOne({ mobile });

    if (existingMobile) {
      return res.status(409).json({
        message: "Mobile already exists"
      });
    }

    // check OTP verification
    const otpStillExists = await Otp.findOne({ sendBy: email });

    if (otpStillExists) {
      return res.status(400).json({
        message: "Please verify OTP first"
      });
    }

    const newUser = await User.create({
      Username,
      email,
      password, // saved normally
      mobile,
      role: role || "user",
      isemailverified: true
    });

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message
    });
  }
};

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required"
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    if (!user.isemailverified) {
      return res.status(400).json({
        message: "Email not verified"
      });
    }

    // password check (no bcrypt)
    if (password !== user.password) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    // ✅ Update last login time
    user.lastLogin = new Date();
    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const userData = user.toObject();
    delete userData.password;

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      message: "Login successful",
      role: user.role,
      lastLogin: user.lastLogin,
      user: userData
    });

  } catch (err) {

    res.status(500).json({
      message: "Internal Server Error"
    });

  }
};