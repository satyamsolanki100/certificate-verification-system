// 1. MUST BE THE VERY FIRST LINE
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path"); // Useful for resolving paths
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const certificateRoutes = require("./routes/certificateRoutes");

// 2. Now that variables are loaded, we can connect
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/certificate", certificateRoutes);

app.get("/", (req, res) => {
  res.send("VIVID Ledger Backend is active");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
