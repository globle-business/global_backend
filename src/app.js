const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// ✅ FIRST create app
const app = express();

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://react-vite-roan-eight.vercel.app/"
];

// ✅ CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed for this origin"));
      }
    },
    credentials: true
  })
);

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// ✅ Use routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/loan-enquiries", enquiryRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);



// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Backend running successfully 🚀");
});

// ✅ Export app
module.exports = app;