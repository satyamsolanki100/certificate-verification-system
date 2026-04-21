const express = require("express");
const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// ================= PUBLIC ROUTES =================
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// ================= ADMIN CREATION (TEMP - RUN ONCE) =================
router.post("/create-admin", async (req, res) => {
  try {
    const User = require("../models/User");

    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = await User.create({
      name: "Admin",
      email: "admin@vivid.com",
      password: "admin123",
      role: "admin",
    });

    res.status(201).json({
      message: "Admin created successfully",
      admin,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= PROTECTED ROUTES =================
router.put("/change-password", protect, changePassword);

module.exports = router;
