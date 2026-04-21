const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); // Multer config for PDF processing
const Certificate = require("../models/Certificate");
const certificateController = require("../controllers/certificateController");
const { protect, authorize } = require("../middleware/authMiddleware");

// ================================================================
// 1. PUBLIC ROUTES (No Login Required)
// ================================================================

/**
 * @desc    Verify Certificate via IPFS Hash (Used by PublicVerify.jsx & QR Codes)
 * @route   GET /api/certificate/verify/:hash
 */
router.get("/verify/:hash", async (req, res) => {
  try {
    const cert = await Certificate.findOne({
      ipfsHash: req.params.hash,
    }).populate("issuedBy", "name email");

    if (!cert) {
      return res.status(404).json({
        verified: false,
        message: "Digital fingerprint not found in the blockchain ledger.",
      });
    }

    res.json({
      verified: true,
      _id: cert._id,
      studentName: cert.studentName,
      universityName: cert.issuedBy?.name || "Official Academic Institution",
      courseName: cert.courseName || "Academic Degree",
      issuedAt: cert.issuedAt,
      status: cert.status,
      ipfsHash: cert.ipfsHash,
      transactionHash:
        cert.transactionHash || "0x" + cert._id.toString().substring(0, 10),
    });
  } catch (error) {
    res.status(500).json({ error: "System Search Failure: " + error.message });
  }
});

/**
 * @desc    Verify via PDF Upload (Anyone can upload a file to check its hash)
 * @route   POST /api/certificate/verify-file
 */
router.post(
  "/verify-file",
  upload.single("certificate"),
  certificateController.verifyCertificate,
);

// ================================================================
// 2. PROTECTED ROUTES (Login Required)
// ================================================================
router.use(protect);

/**
 * @desc    Student Vault: Returns certificates linked to the logged-in user's email
 * @route   GET /api/certificate/my-vault
 * @access  Private (Student/Admin)
 */
router.get("/my-vault", async (req, res) => {
  try {
    // req.user is provided by the 'protect' middleware after JWT verification
    const certs = await Certificate.find({ studentEmail: req.user.email })
      .populate("issuedBy", "name email")
      .sort({ issuedAt: -1 });

    res.json(certs);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Vault Retrieval Failure: " + error.message });
  }
});

// ================================================================
// 3. ADMIN/UNIVERSITY ROUTES (Higher Privileges)
// ================================================================

/**
 * @desc    Issue Certificate: Mints record to DB and IPFS
 * @route   POST /api/certificate/issue
 * @access  Private (Admin Only)
 */
router.post(
  "/issue",
  authorize("admin", "university"),
  upload.single("certificate"),
  certificateController.issueCertificate,
);

/**
 * @desc    Revoke Certificate: Invalidates a certificate on the ledger
 * @route   PUT /api/certificate/revoke/:certId
 * @access  Private (Admin Only)
 */
router.put(
  "/revoke/:certId",
  authorize("admin", "university"),
  certificateController.revokeCertificate,
);

/**
 * @desc    Global Ledger: Returns ALL certificates in the system
 * @route   GET /api/certificate/all
 * @access  Private (Admin Only)
 */
router.get("/all", authorize("admin", "university"), async (req, res) => {
  try {
    const certs = await Certificate.find()
      .populate("issuedBy", "name email")
      .sort({ issuedAt: -1 });

    res.json(certs);
  } catch (error) {
    res.status(500).json({ error: "Ledger Sync Failure: " + error.message });
  }
});

module.exports = router;
