const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// POST: Submit feedback
router.post('/', async (req, res) => {
  try {
    const { name, email, product, feedback, rating } = req.body;
    const newFeedback = new Feedback({
      name,
      email,
      product,
      feedback,
      rating,
    });
    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    console.error('Error saving feedback:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET: Get all feedbacks
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
});

module.exports = router;
