const Feedback = require('../models/Feedback');

exports.createFeedback = async (req, res) => {
  try {
    const { message } = req.body;
    const newFeedback = new Feedback({ message });
    await newFeedback.save();
    res.status(201).json({ success: true, message: "Feedback saved" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json({ success: true, data: feedbacks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
