const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

// ✅ Load environment variables
dotenv.config();

// ✅ Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Basic health check
app.get("/", (req, res) => {
  res.send("✅ Backend is working!");
});

// ✅ Read Mongo URI
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("❌ MONGODB_URI is not defined in environment variables");
  process.exit(1);
}

// ✅ MongoDB connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ✅ Feedback schema & model
const Feedback = mongoose.model("Feedback", {
  message: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ POST /api/feedback - Submit feedback
app.post("/api/feedback", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ success: false, error: "Message is required" });
    }

    const feedback = new Feedback({ message });
    await feedback.save();

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Error saving feedback:", error.message);
    res.status(500).json({ success: false, error: "Failed to save feedback" });
  }
});

// ✅ GET /api/feedback - View all feedback
app.get("/api/feedback", async (req, res) => {
  try {
    const feedbackList = await Feedback.find().sort({ createdAt: -1 });
    res.json({ success: true, data: feedbackList });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch feedback" });
  }
});

// ✅ Admin login
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!ADMIN_PASSWORD || !JWT_SECRET) {
    return res.status(500).json({ error: "Server not properly configured for admin login." });
  }

  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign({ isAdmin: true }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid admin password" });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
