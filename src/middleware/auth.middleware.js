const jwt = require("jsonwebtoken");





exports.authenticate = (req, res, next) => {
  try {
    // 🔥 GET TOKEN FROM COOKIE
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        message: "Access denied. No token provided"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};
// ✅ AUTHORIZE → check role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !roles.includes(req.user.role)) {
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