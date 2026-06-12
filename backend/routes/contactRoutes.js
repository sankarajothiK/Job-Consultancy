const express = require('express');
const router = express.Router();
const {
  submitMessage,
  getAllMessages,
  deleteMessage,
} = require('../controllers/contactController');
const { protectAdmin } = require('../middleware/auth');

// Public: Submit contact inquiry
router.post('/', submitMessage);

// Protected: Admin manage messages
router.get('/', protectAdmin, getAllMessages);
router.delete('/:id', protectAdmin, deleteMessage);

module.exports = router;
