const express = require("express");
const router = express.Router();

const {
  sendOtp,
  verifyOtp,
  signup,
  login,
  // getAllUsers
} = require("../controllers/authController");

const { authenticate, authorize } = require("../middleware/auth.middleware");
const { getAllUsers } = require("../controllers/userController");

/* ================= AUTH ================= */

router.post("/send-otp", sendOtp);

router.post("/verify-otp", verifyOtp);

router.post("/signup", signup);

router.post("/login", login);



/* ================= ADMIN ================= */

// admin → get all users
router.get("/all-users", authenticate, authorize("admin"), getAllUsers);


module.exports = router;