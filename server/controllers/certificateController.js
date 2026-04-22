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

    // AUTO CREATE USER
    let user = await User.findOne({ email: cleanEmail });
    const tempPassword = crypto.randomBytes(4).toString("hex");

    if (!user) {
      const hashedPassword = await bcrypt.hash(tempPassword, 10);
      user = await User.create({
        name: studentName,
        email: cleanEmail,
        password: hashedPassword,
        role: "student",
      });
      console.log(`[AUTH] New student created: ${cleanEmail}`);
    }

    if (!req.file) {
      return res.status(400).json({ message: "Certificate file required" });
    }

    const filePath = req.file.path;
    const certHash = generateHash(filePath);

    // ================= IPFS UPLOAD =================
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

    // ================= BLOCKCHAIN DEBUG =================
    let txHash = null;

    try {
      console.log("🚀 Sending transaction to blockchain...");
      console.log("Hash:", certHash);

      const tx = await contract.storeCertificate(certHash);

      console.log("⏳ Waiting for confirmation...");
      await tx.wait();

      txHash = tx.hash;
      console.log("✅ Transaction Success:", txHash);
    } catch (err) {
      console.error("❌ Blockchain Error FULL:", err);

      if (err.reason && err.reason.includes("exists")) {
        txHash = "ALREADY_ANCHORED";
      } else {
        return res.status(500).json({
          error: "Blockchain transaction failed",
          details: err.message,
        });
      }
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

    // ================= QR CODE =================
    const verificationUrl = `${process.env.BASE_URL}/api/certificate/public/${newCert._id}`;
    const qrFileName = `${newCert._id}-qr.png`;
    const uploadsDir = path.join(__dirname, "../uploads");

    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

    const qrPath = path.join(uploadsDir, qrFileName);
    await QRCode.toFile(qrPath, verificationUrl);

    newCert.qrCode = qrFileName;
    await newCert.save();

    // ================= EMAIL =================
    const emailBody = `
      <h2>Certificate Issued</h2>
      <p>Login using:</p>
      <p>Email: ${cleanEmail}</p>
      <p>Password: ${tempPassword}</p>
    `;

    await sendEmail({
      email: cleanEmail,
      subject: "Certificate Issued",
      message: emailBody,
    });

    // cleanup
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.status(201).json({
      success: true,
      certificate: newCert,
    });
  } catch (error) {
    console.error("❌ ISSUE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// ================================================================
// OTHER FUNCTIONS (UNCHANGED)
// ================================================================

exports.getStudentCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find({ studentEmail: req.user.email }).sort(
      {
        issuedAt: -1,
      },
    );
    res.json(certs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vault" });
  }
};

exports.getAllCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find().sort({ issuedAt: -1 });
    res.json(certs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPublicCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.certId).populate(
      "issuedBy",
      "name email",
    );

    if (!cert) return res.status(404).json({ message: "Not found" });

    res.json(cert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyCertificate = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const uploadedHash = generateHash(req.file.path);

    const certificate = await Certificate.findOne({
      certHash: uploadedHash,
    });

    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    if (!certificate)
      return res.status(404).json({
        valid: false,
        message: "Mismatch detected",
      });

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
