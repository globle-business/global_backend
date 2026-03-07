const jwt = require("jsonwebtoken");

/* ================= AUTHENTICATE USER ================= */

exports.authenticate = (req, res, next) => {
  try {

    let token;

    // 🔹 Check token from cookie
    if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    // 🔹 Check token from Authorization header
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user to request
    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });

  }
};


/* ================= AUTHORIZE ROLES ================= */

exports.authorize = (...roles) => {

  return (req, res, next) => {

    try {

      if (!req.user) {
        return res.status(401).json({
          message: "User not authenticated"
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Access forbidden: insufficient permissions"
        });
      }

      next();

    } catch (error) {

      return res.status(500).json({
        message: "Authorization error"
      });

    }

  };

};