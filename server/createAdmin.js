const path = require("path");
// Force load from the exact folder where this script lives
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

async function run() {
  console.log("--- DEBUG START ---");
  console.log("Current Directory:", __dirname);

  // Check every possible name for the connection string
  const uri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    process.env.DATABASE_URL;

  if (!uri) {
    console.error("❌ ERROR: No MongoDB URI found in .env!");
    console.log(
      "Your .env currently contains these keys:",
      Object.keys(process.env).filter((k) => !k.startsWith("NODE_")),
    );
    process.exit(1);
  }

  console.log("✅ URI Found (First 10 chars):", uri.substring(0, 10) + "...");

  try {
    await mongoose.connect(uri);
    console.log("🚀 Connected to MongoDB.");

    const adminEmail = "admin@vivid.com";
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Update or Create
    await User.findOneAndUpdate(
      { email: adminEmail },
      {
        name: "System Admin",
        password: hashedPassword,
        role: "admin",
      },
      { upsert: true, new: true },
    );

    console.log("\n-----------------------------------------");
    console.log("SUCCESS: Admin account ready.");
    console.log("User: admin@vivid.com");
    console.log("Pass: admin123");
    console.log("-----------------------------------------");
  } catch (err) {
    console.error("❌ Database Error:", err.message);
  } finally {
    mongoose.connection.close();
  }
}

run();
