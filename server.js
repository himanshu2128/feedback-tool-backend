const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express(); // ✅ This should come BEFORE routes

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Feedback schema
const Feedback = mongoose.model("Feedback", {
  message: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Routes
app.post("/api/feedback", async (req, res) => {
  const { message } = req.body;
  const feedback = new Feedback({ message });
  await feedback.save();
  res.json({ success: true });
});

// ✅ Fix here — move this after `app = express()` declaration
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
