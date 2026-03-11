const Enquiry = require("../models/EnquiryModel");

exports.getDashboardStats = async (req, res) => {
  try {

    /* ================= TOTAL APPLICANTS ================= */

    const totalApplicants = await Enquiry.countDocuments({
      isDeleted: false
    });

    /* ================= ACTIVE LOANS ================= */

    const activeLoans = await Enquiry.countDocuments({
      enquiryStatus: { $in: ["new", "in-progress"] },
      isDeleted: false
    });

    /* ================= APPROVED LOANS ================= */

    const approvedLoans = await Enquiry.countDocuments({
      enquiryStatus: "approved",
      isDeleted: false
    });

    /* ================= TOTAL DISBURSED ================= */

    const disbursedData = await Enquiry.aggregate([
      {
        $match: {
          enquiryStatus: "approved",
          isDeleted: false
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$loanAmount" }
        }
      }
    ]);

    const totalDisbursed =
      disbursedData.length > 0 ? disbursedData[0].totalAmount : 0;


    /* ================= RECENT APPLICATIONS ================= */

    const recentApplications = await Enquiry.find({
      isDeleted: false
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("fullName loanType loanAmount enquiryStatus createdAt");


    /* ================= RESPONSE ================= */

    res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",

      dashboard: {
        totalApplicants,
        activeLoans,
        approvedLoans,
        totalDisbursed,
        recentApplications
      }
    });

  } catch (error) {

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });

  }
};