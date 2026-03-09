const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
  changePassword

} = require("../controllers/userController");

const { authenticate } = require("../middleware/auth.middleware");
const { toggleUserStatus } = require("../controllers/userController");

router.patch("/toggle-status/:id", authenticate, toggleUserStatus);


// Protected Routes

router.get("/all-users", authenticate, getAllUsers);

router.post("/create-user", authenticate, createUser);

router.get("/user/:id", authenticate, getSingleUser);

router.put("/update-user/:id", authenticate, updateUser);

router.delete("/delete-user/:id", authenticate, deleteUser);

router.patch("/change-password/:id", authenticate, changePassword);


module.exports = router;