const JobOpening = require('../models/JobOpening');

// @desc    Get all active job openings for public
// @route   GET /api/jobs
// @access  Public
const getPublicOpenings = async (req, res) => {
  try {
    const openings = await JobOpening.find({ status: 'active' }).sort({ createdAt: -1 });
    res.json({ success: true, count: openings.length, data: openings });
  } catch (error) {
    console.error('Error fetching public jobs:', error);
    res.status(500).json({ success: false, message: 'Server error fetching jobs' });
  }
};

// @desc    Get all openings for admin
// @route   GET /api/jobs/all
// @access  Private
const getAllOpenings = async (req, res) => {
  try {
    const openings = await JobOpening.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: openings.length, data: openings });
  } catch (error) {
    console.error('Error fetching all jobs:', error);
    res.status(500).json({ success: false, message: 'Server error fetching jobs' });
  }
};

// @desc    Create a job opening
// @route   POST /api/jobs
// @access  Private
const createOpening = async (req, res) => {
  try {
    const jobData = { ...req.body };
    
    // Ensure requiredSkills is an array
    if (typeof jobData.requiredSkills === 'string') {
      jobData.requiredSkills = jobData.requiredSkills.split(',').map(s => s.trim()).filter(s => s);
    }

    const newOpening = await JobOpening.create(jobData);
    res.status(201).json({ success: true, data: newOpening });
  } catch (error) {
    console.error('Error creating job:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error creating job opening' });
  }
};

// @desc    Update a job opening
// @route   PUT /api/jobs/:id
// @access  Private
const updateOpening = async (req, res) => {
  try {
    const jobData = { ...req.body };
    
    if (typeof jobData.requiredSkills === 'string') {
      jobData.requiredSkills = jobData.requiredSkills.split(',').map(s => s.trim()).filter(s => s);
    }

    const opening = await JobOpening.findByIdAndUpdate(req.params.id, jobData, {
      new: true,
      runValidators: true,
    });

    if (!opening) {
      return res.status(404).json({ success: false, message: 'Job opening not found' });
    }

    res.json({ success: true, data: opening });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ success: false, message: 'Server error updating job opening' });
  }
};

// @desc    Delete a job opening
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteOpening = async (req, res) => {
  try {
    const opening = await JobOpening.findByIdAndDelete(req.params.id);

    if (!opening) {
      return res.status(404).json({ success: false, message: 'Job opening not found' });
    }

    res.json({ success: true, message: 'Job opening deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ success: false, message: 'Server error deleting job opening' });
  }
};

module.exports = {
  getPublicOpenings,
  getAllOpenings,
  createOpening,
  updateOpening,
  deleteOpening,
};
