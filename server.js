const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config(); // Load .env variables

const app = express(); // Express app initialized before routes

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('✅ Backend is working!');
});

// ✅ MongoDB connection using environment variable
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Schema & model
const Feedback = mongoose.model("Feedback", {
  message: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Feedback submit route
app.post("/api/feedback", async (req, res) => {
  const { message } = req.body;
  const feedback = new Feedback({ message });
  await feedback.save();
  res.json({ success: true });
});

// Admin login route
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ isAdmin: true }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.json({ token });
  } else {
    return res.status(401).json({ error: "Invalid password" });
  }
});

// Start server
app.listen(5000, () => {
  console.log("✅ Server is running on http://localhost:5000");
});
