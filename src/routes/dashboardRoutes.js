const express = require("express");
const router = express.Router();

const { getDashboardStats } = require("../controllers/dashboardController");

const { authenticate, authorize } = require("../middleware/auth.middleware");

// Admin dashboard
router.get(
  "/admin-dashboard",
  authenticate,
  authorize("admin"),
  getDashboardStats
);

module.exports = router;