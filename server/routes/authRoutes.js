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

// ================= PUBLIC AUTH ROUTES =================
// Anyone can access these to join or recover their account

router.post("/register", register);
router.post("/login", login);

// Access Recovery Flow (Resolves the 404 error in your screenshot)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// ================= PROTECTED AUTH ROUTES =================
// Requires a valid Bearer Token (JWT) in the header

router.put("/change-password", protect, changePassword);

module.exports = router;
