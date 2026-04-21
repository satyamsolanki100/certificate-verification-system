require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const certificateRoutes = require("./routes/certificateRoutes");

// connect DB
connectDB();

const app = express();

/* ================= CORS ================= */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://certificate-verification-system-nwlu.onrender.com",
    ],
    credentials: true,
  })
);
/* ======================================= */

app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/certificate", certificateRoutes);

app.get("/", (req, res) => {
  res.send("VIVID Ledger Backend is active");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});