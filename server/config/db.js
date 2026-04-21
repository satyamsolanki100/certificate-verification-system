const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Changed MONGO_URI to MONGODB_URI to match your .env file
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("📡 MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
