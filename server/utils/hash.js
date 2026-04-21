const crypto = require("crypto");
const fs = require("fs");

/**
 * Generates a SHA-256 hash of a file at a given path.
 * Used for creating the digital fingerprint for the blockchain.
 */
const generateHash = (filePath) => {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const hash = crypto.createHash("sha256").update(fileBuffer).digest("hex");
    return hash;
  } catch (error) {
    console.error("Hash Generation Error:", error);
    throw new Error("Failed to read file for hashing");
  }
};

module.exports = generateHash;
