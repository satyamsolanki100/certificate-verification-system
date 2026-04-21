const Certificate = require("../models/Certificate");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const generateHash = require("../utils/hash");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const contract = require("../utils/blockchain");
const QRCode = require("qrcode");
const path = require("path");
const sendEmail = require("../utils/sendEmail");

// ================================================================
// 1. ISSUE CERTIFICATE (WITH UNIQUE USER CREATION & EMAIL)
// ================================================================
exports.issueCertificate = async (req, res) => {
  try {
    const { studentName, studentEmail, studentWallet, courseName } = req.body;

    if (!studentName || !studentWallet || !studentEmail) {
      return res.status(400).json({ message: "Missing student details" });
    }

    const cleanEmail = studentEmail.trim().toLowerCase();

    // AUTO CREATE USER LOGIC
    let user = await User.findOne({ email: cleanEmail });
    let isNewUser = false;
    const tempPassword = crypto.randomBytes(4).toString("hex");

    if (!user) {
      const hashedPassword = await bcrypt.hash(tempPassword, 10);
      user = await User.create({
        name: studentName,
        email: cleanEmail,
        password: hashedPassword,
        role: "student",
      });
      isNewUser = true;
      console.log(`[AUTH] New student account auto-provisioned: ${cleanEmail}`);
    }

    if (!req.file) {
      return res.status(400).json({ message: "Certificate file required" });
    }

    const filePath = req.file.path;
    const certHash = generateHash(filePath);

    // IPFS Upload
    const data = new FormData();
    data.append("file", fs.createReadStream(filePath));

    const pinataResponse = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data,
      {
        maxBodyLength: Infinity,
        headers: {
          ...data.getHeaders(),
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
        },
      },
    );

    const ipfsHash = pinataResponse.data.IpfsHash;

    // Blockchain Anchor
    let txHash = null;
    try {
      const tx = await contract.storeCertificate(certHash);
      await tx.wait();
      txHash = tx.hash;
    } catch (err) {
      txHash = err.reason?.includes("exists")
        ? "ALREADY_ANCHORED"
        : "ERROR_ANCHORING";
    }

    const issuedBy = req.user?.id || null;

    const newCert = await Certificate.create({
      studentName,
      studentEmail: cleanEmail,
      studentWallet,
      courseName: courseName || "Academic Credential",
      certHash,
      issuedBy,
      status: "active",
      ipfsHash,
      transactionHash: txHash,
    });

    // QR Code Generation
    const verificationUrl = `http://localhost:5000/api/certificates/public/${newCert._id}`;
    const qrFileName = `${newCert._id}-qr.png`;
    const uploadsDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

    const qrPath = path.join(uploadsDir, qrFileName);
    await QRCode.toFile(qrPath, verificationUrl);
    newCert.qrCode = qrFileName;
    await newCert.save();

    // Email logic remains same...
    const emailBody = `<h2>Certificate Issued</h2><p>Login to your vault: ${cleanEmail}</p>`;
    await sendEmail({
      email: cleanEmail,
      subject: "Certificate Issued",
      message: emailBody,
    });

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.status(201).json({ success: true, certificate: newCert });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================================================================
// 2. STUDENT VAULT (THE FIX: Filters by current user's email)
// ================================================================
exports.getStudentCertificates = async (req, res) => {
  try {
    // req.user is provided by your authentication middleware
    const certs = await Certificate.find({ studentEmail: req.user.email }).sort(
      { issuedAt: -1 },
    );

    res.json(certs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your vault data" });
  }
};

// ================================================================
// 3. ADMINISTRATIVE CONTROLS (GLOBAL LEDGER)
// ================================================================
exports.getAllCertificates = async (req, res) => {
  try {
    // This remains for Admins to see EVERY certificate
    const certs = await Certificate.find().sort({ issuedAt: -1 });
    res.json(certs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================================================================
// 4. VERIFICATION & PUBLIC ACCESS
// ================================================================
exports.getPublicCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.certId).populate(
      "issuedBy",
      "name email",
    );
    if (!cert)
      return res.status(404).json({ message: "Certificate not found" });
    res.json(cert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyCertificate = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No document uploaded" });
    const uploadedFileHash = generateHash(req.file.path);
    const certificate = await Certificate.findOne({
      certHash: uploadedFileHash,
    });
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    if (!certificate)
      return res
        .status(404)
        .json({ valid: false, message: "Mismatch detected" });
    res.json({ valid: true, certificate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.revokeCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findByIdAndUpdate(
      req.params.certId,
      { status: "revoked" },
      { new: true },
    );
    res.json({ success: true, cert });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Password management functions (forgotPassword/resetPassword) should follow here...
