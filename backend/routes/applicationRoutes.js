const express = require('express');
const router = express.Router();
const {
  submitApplication,
  getAllApplications,
  deleteApplication,
} = require('../controllers/applicationController');
const { protectAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public: Apply for a job (with resume upload)
router.post('/', upload.single('resume'), submitApplication);

// Protected: Admin manage applications
router.get('/', protectAdmin, getAllApplications);
router.delete('/:id', protectAdmin, deleteApplication);

module.exports = router;
