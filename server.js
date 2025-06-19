// server.js — Backend entry point
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

// Load .env variables
dotenv.config();

// ✅ Use MONGODB_URI as you requested
const { MONGODB_URI, ADMIN_PASSWORD, JWT_SECRET, PORT = 5000 } = process.env;

if (!MONGODB_URI || !ADMIN_PASSWORD || !JWT_SECRET) {
  console.error("❌ Missing required environment variables.");
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Feedback Schema
const Feedback = mongoose.model("Feedback", {
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Health check
app.get("/", (req, res) => res.send("🚀 Feedback backend is running"));

// Add feedback
app.post("/api/feedback", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.trim() === "") {
      return res.status(400).json({ success: false, error: "Message is required." });
    }
    await new Feedback({ message }).save();
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error saving feedback:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// Get feedback list
app.get("/api/feedback", async (req, res) => {
  try {
    const feedbackList = await Feedback.find().sort({ createdAt: -1 });
    res.json({ success: true, data: feedbackList });
  } catch (err) {
    res.status(500).json({ success: false, error: "Error fetching feedback" });
  }
});

// ✅ Delete feedback by ID
app.delete("/api/feedback/:id", async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Feedback deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Error deleting feedback" });
  }
});

// Admin login with password & JWT
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Invalid password" });
  }
  const token = jwt.sign({ isAdmin: true }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
