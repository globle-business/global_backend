const Enquiry = require("../models/EnquiryModel");

/* ================= CREATE ENQUIRY ================= */
exports.createEnquiry = async (req, res) => {
  try {

    const {
      fullName,
      email,
      mobileNumber,
      state,
      zipCode,
      loanType,
      loanAmount,
      employmentStatus
    } = req.body;

    // validation
    if (
      !fullName ||
      !email ||
      !mobileNumber ||
      !state ||
      !zipCode ||
      !loanType ||
      !loanAmount ||
      !employmentStatus
    ) {
      return res.status(400).json({
        message: "All fields are required"
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

    if (!mobilePattern.test(mobileNumber)) {
      return res.status(400).json({
        message: "Invalid mobile number"
      });
    }

    const enquiry = await Enquiry.create({
      user: req.user._id, // from auth middleware
      fullName,
      email,
      mobileNumber,
      state,
      zipCode,
      loanType,
      loanAmount,
      employmentStatus
    });

    res.status(201).json({
      success: true,
      message: "Loan enquiry submitted successfully",
      enquiry
    });

  } catch (error) {

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });

  }
};



/* ================= GET MY ENQUIRIES ================= */

exports.getMyEnquiries = async (req, res) => {

  try {

    const enquiries = await Enquiry.find({
      email: req.user.email,
      isDeleted: false
    });

    res.status(200).json({
      success: true,
      message: "My enquiries fetched successfully",
      total: enquiries.length,
      enquiries
    });

  } catch (error) {

    res.status(500).json({
      message: "Internal Server Error"
    });

  }

};



/* ================= GET ALL ENQUIRIES (ADMIN) ================= */

exports.getAllEnquiries = async (req, res) => {

  try {

    const enquiries = await Enquiry.find({ isDeleted: false });

    res.status(200).json({
      success: true,
      message: "Enquiries fetched successfully",
      total: enquiries.length,
      enquiries
    });

  } catch (error) {

    res.status(500).json({
      message: "Internal Server Error"
    });

  }

};



/* ================= GET SINGLE ENQUIRY ================= */

exports.getSingleEnquiry = async (req, res) => {

  try {

    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry || enquiry.isDeleted) {
      return res.status(404).json({
        message: "Enquiry not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry fetched successfully",
      enquiry
    });

  } catch (error) {

    res.status(500).json({
      message: "Internal Server Error"
    });

  }

};



/* ================= SOFT DELETE ================= */

exports.deleteEnquiry = async (req, res) => {

  try {

    const { id } = req.params;

    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!enquiry) {
      return res.status(404).json({
        message: "Enquiry not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });

  }

};