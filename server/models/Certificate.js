const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  // Recipient Details
  studentName: {
    type: String,
    required: true,
    trim: true,
  },
  studentEmail: {
    // Added to match your IssueCertificate.jsx state
    type: String,
    required: true,
    lowercase: true,
  },
  studentWallet: {
    type: String,
    required: true,
    fontMono: true, // Logic hint for frontend
  },

  // Academic Content
  courseName: {
    // Added to match your IssueCertificate.jsx state
    type: String,
    required: true,
  },
  description: String,

  // Cryptographic Proofs
  certHash: {
    type: String,
    required: true,
    unique: true, // Prevents duplicate minting of the same hash
  },
  ipfsHash: {
    type: String, // Stores the URL/Hash from Pinata or Cloudinary
  },
  transactionHash: {
    type: String, // The Web3 transaction ID if using a real chain
    default: "0x" + Math.random().toString(16).slice(2, 10) + "...",
  },
  qrCode: {
    type: String, // Base64 string for the verification QR
  },

  // Governance
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["active", "revoked"],
    default: "active",
  },

  // Metadata
  issuedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create an index for fast searching during public verification
certificateSchema.index({ certHash: 1, studentEmail: 1 });

module.exports = mongoose.model("Certificate", certificateSchema);
