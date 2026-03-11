const express = require("express");
const router = express.Router();

const {
  createEnquiry,
  getAllEnquiries,
  getSingleEnquiry,
  deleteEnquiry,
  getMyEnquiries,
  getLoanTypes,
  addLoanType,
  toggleLoanType

} = require("../controllers/enquiryController");


const { authenticate, authorize } = require("../middleware/auth.middleware");

/* ================= USER ROUTES ================= */

// create new enquiry
router.post("/create-enquiry", authenticate, createEnquiry);

// get logged in user's enquiries
router.get("/my-enquiries", authenticate, getMyEnquiries);


/* ================= ADMIN ROUTES ================= */

// admin → get all enquiries
router.get("/all-enquiries", authenticate, authorize("admin"), getAllEnquiries);

// admin → get enquiry by id
router.get("/enquiry/:id", authenticate, authorize("admin"), getSingleEnquiry);

// admin → delete enquiry
router.delete("/delete-enquiry/:id", authenticate, authorize("admin"), deleteEnquiry);


// get active loan types
router.get("/loan-types", getLoanTypes);

// add loan type (admin)
router.post(
  "/add-loan-type",
  authenticate,
  authorize("admin"),
  addLoanType
);

// activate / deactivate
router.patch(
  "/toggle-loan-type/:id",
  authenticate,
  authorize("admin"),
  toggleLoanType
);

module.exports = router;