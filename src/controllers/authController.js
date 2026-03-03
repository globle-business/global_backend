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
    const { Username, password, email, mobile } = req.body;

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

    // check user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists"
      });
    }

    const existingMobile = await User.findOne({ mobile });
    if (existingMobile) {
      return res.status(409).json({
        message: "Mobile already exists"
      });
    }

    // ✅ IMPORTANT: OTP must NOT exist (means already verified)
    const otpStillExists = await Otp.findOne({ sendBy: email });
    if (otpStillExists) {
      return res.status(400).json({
        message: "Please verify OTP first"
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      Username,
      email,
      password: hashedPassword,
      mobile,
      isemailverified: true
    });
    const checkUser = await User.findById(newUser._id);
console.log("User fetched after save:", checkUser);

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: newUser._id,
        email: newUser.email
      }
    });

  } catch (err) {
    res.status(500).json({
      message: "Internal Server error",
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

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const userData = user.toObject();
    delete userData.password;

    // ✅ Store tokens in HTTP-only cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 60 * 60 * 1000 // 1 hour
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: "Login successful",
      user: userData
    });

  } catch (err) {
    return res.status(500).json({
      message: "Internal Server error"
    });
  }
};

