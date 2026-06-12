const express = require('express');
const router = express.Router();
const {
  getPublicOpenings,
  getAllOpenings,
  createOpening,
  updateOpening,
  deleteOpening,
} = require('../controllers/jobController');
const { protectAdmin } = require('../middleware/auth');

// Public: Get active job openings
router.get('/', getPublicOpenings);

// Protected Admin CRUD operations
router.get('/all', protectAdmin, getAllOpenings);
router.post('/', protectAdmin, createOpening);
router.put('/:id', protectAdmin, updateOpening);
router.delete('/:id', protectAdmin, deleteOpening);

module.exports = router;
