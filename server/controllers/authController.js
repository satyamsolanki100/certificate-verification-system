const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: cleanEmail,
      password: hashedPassword,
      role: role || "student",
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: cleanEmail });
    if (!user)
      return res.status(400).json({ message: "Invalid identity credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid identity credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "SECRETKEY",
      { expiresIn: "1d" },
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================= FORGOT PASSWORD (OTP GENERATION) =================
exports.forgotPassword = async (req, res) => {
  try {
    const cleanEmail = req.body.email.trim().toLowerCase();
    // 🛡️ Only allows existing users (students) to reset
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Access Denied: Email not registered in vault" });
    }

    // 🔢 Generate 6-Digit Numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP and Expiry (10 mins) to DB
    user.resetPasswordToken = otp;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    const emailTemplate = `
      <div style="background:#000; color:#fff; padding:30px; font-family:sans-serif; border:1px solid #ff4500; border-radius:10px;">
        <h2 style="color:#ff4500; text-align:center;">VIVID SECURITY OTP</h2>
        <p>A password reset was requested for your student vault.</p>
        <div style="background:#111; padding:20px; text-align:center; border-radius:5px; margin:20px 0;">
          <span style="font-size:32px; font-weight:bold; color:#ff4500; letter-spacing:10px;">${otp}</span>
        </div>
        <p style="color:#888; font-size:12px;">This code expires in 10 minutes. If you did not request this, secure your account immediately.</p>
      </div>
    `;

    await sendEmail({
      email: user.email,
      subject: "VIVID Access Recovery OTP",
      message: emailTemplate,
    });

    res
      .status(200)
      .json({ success: true, message: "Security OTP sent to Gmail" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================= RESET PASSWORD (OTP VERIFICATION) =================
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: cleanEmail,
      resetPasswordToken: otp,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired Security OTP" });
    }

    // Update password and clear OTP fields
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Vault password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================= CHANGE PASSWORD (FOR DASHBOARD) =================
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Current password incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
