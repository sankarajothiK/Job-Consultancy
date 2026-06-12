const Placement = require('../models/Placement');
const { uploadToCloudinary } = require('../config/cloudinary');

// @desc    Get all placements for public view
// @route   GET /api/placements
// @access  Public
const getPublicPlacements = async (req, res) => {
  try {
    const placements = await Placement.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: placements.length, data: placements });
  } catch (error) {
    console.error('Error fetching public placements:', error);
    res.status(500).json({ success: false, message: 'Server error fetching placements' });
  }
};

// @desc    Get all placements for admin
// @route   GET /api/placements/all
// @access  Private (Admin only)
const getAllPlacements = async (req, res) => {
  try {
    const placements = await Placement.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: placements.length, data: placements });
  } catch (error) {
    console.error('Error fetching all placements:', error);
    res.status(500).json({ success: false, message: 'Server error fetching placements' });
  }
};

// @desc    Create a new placement record
// @route   POST /api/placements
// @access  Private (Admin only, includes candidate photo and optional offer letter uploads)
const createPlacement = async (req, res) => {
  try {
    let candidatePhoto = '';
    let offerLetter = '';

    // Check files
    if (req.files) {
      if (req.files['candidatePhoto'] && req.files['candidatePhoto'][0]) {
        const photoFile = req.files['candidatePhoto'][0];
        candidatePhoto = await uploadToCloudinary(
          photoFile.buffer,
          'tenkasi_jobs/placements',
          photoFile.originalname,
          'image'
        );
      }

      if (req.files['offerLetter'] && req.files['offerLetter'][0]) {
        const offerFile = req.files['offerLetter'][0];
        offerLetter = await uploadToCloudinary(
          offerFile.buffer,
          'tenkasi_jobs/offer_letters',
          offerFile.originalname,
          'image'
        );
      }
    }

    // Candidate photo is optional

    const placementData = {
      ...req.body,
      candidatePhoto,
      offerLetter,
    };

    const placement = await Placement.create(placementData);
    res.status(201).json({ success: true, data: placement });
  } catch (error) {
    console.error('Error creating placement:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error creating placement record' });
  }
};

// @desc    Update a placement record
// @route   PUT /api/placements/:id
// @access  Private (Admin only)
const updatePlacement = async (req, res) => {
  try {
    const existingPlacement = await Placement.findById(req.params.id);
    if (!existingPlacement) {
      return res.status(404).json({ success: false, message: 'Placement record not found' });
    }

    let candidatePhoto = existingPlacement.candidatePhoto;
    let offerLetter = existingPlacement.offerLetter;

    // Check files update
    if (req.files) {
      if (req.files['candidatePhoto'] && req.files['candidatePhoto'][0]) {
        const photoFile = req.files['candidatePhoto'][0];
        candidatePhoto = await uploadToCloudinary(
          photoFile.buffer,
          'tenkasi_jobs/placements',
          photoFile.originalname,
          'image'
        );
      }

      if (req.files['offerLetter'] && req.files['offerLetter'][0]) {
        const offerFile = req.files['offerLetter'][0];
        offerLetter = await uploadToCloudinary(
          offerFile.buffer,
          'tenkasi_jobs/offer_letters',
          offerFile.originalname,
          'image'
        );
      }
    }

    const placementData = {
      ...req.body,
      candidatePhoto,
      offerLetter,
    };

    const updatedPlacement = await Placement.findByIdAndUpdate(req.params.id, placementData, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: updatedPlacement });
  } catch (error) {
    console.error('Error updating placement:', error);
    res.status(500).json({ success: false, message: 'Server error updating placement record' });
  }
};

// @desc    Delete a placement record
// @route   DELETE /api/placements/:id
// @access  Private (Admin only)
const deletePlacement = async (req, res) => {
  try {
    const placement = await Placement.findByIdAndDelete(req.params.id);

    if (!placement) {
      return res.status(404).json({ success: false, message: 'Placement record not found' });
    }

    res.json({ success: true, message: 'Placement record deleted successfully' });
  } catch (error) {
    console.error('Error deleting placement:', error);
    res.status(500).json({ success: false, message: 'Server error deleting placement record' });
  }
};

module.exports = {
  getPublicPlacements,
  getAllPlacements,
  createPlacement,
  updatePlacement,
  deletePlacement,
};
