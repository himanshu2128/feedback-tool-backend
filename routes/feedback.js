const express = require('express');
const router = express.Router();
const { createFeedback, getAllFeedback } = require('../controllers/feedbackController');

router.post('/feedback', createFeedback);
router.get('/feedback', getAllFeedback); // we’ll build this next
router.delete('/:id', deleteFeedback);

module.exports = router;
