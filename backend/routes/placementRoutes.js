const express = require('express');
const router = express.Router();
const {
  getPublicPlacements,
  getAllPlacements,
  createPlacement,
  updatePlacement,
  deletePlacement,
} = require('../controllers/placementController');
const { protectAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public: Get placement statistics
router.get('/', getPublicPlacements);

// Protected: Admin manage placements
router.get('/all', protectAdmin, getAllPlacements);

router.post(
  '/',
  protectAdmin,
  upload.fields([
    { name: 'candidatePhoto', maxCount: 1 },
    { name: 'offerLetter', maxCount: 1 },
  ]),
  createPlacement
);

router.put(
  '/:id',
  protectAdmin,
  upload.fields([
    { name: 'candidatePhoto', maxCount: 1 },
    { name: 'offerLetter', maxCount: 1 },
  ]),
  updatePlacement
);

router.delete('/:id', protectAdmin, deletePlacement);

module.exports = router;
