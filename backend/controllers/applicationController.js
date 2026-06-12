const JobApplication = require('../models/JobApplication');
const { uploadToCloudinary } = require('../config/cloudinary');

// @desc    Submit a job application (Public)
// @route   POST /api/applications
// @access  Public (Includes file upload)
const submitApplication = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a resume (PDF)' });
    }

    // Upload resume to Cloudinary (using 'raw' resource type for PDFs to retain extension/binary layout)
    let resumeUrl;
    try {
      resumeUrl = await uploadToCloudinary(
        req.file.buffer,
        'tenkasi_jobs/resumes',
        req.file.originalname,
        'image'
      );
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError);
      return res.status(500).json({ success: false, message: 'Failed to upload resume' });
    }

    const appData = { ...req.body };
    appData.resumeUrl = resumeUrl;

    // Parse array fields if they are sent as strings
    if (typeof appData.skills === 'string') {
      try {
        appData.skills = JSON.parse(appData.skills);
      } catch (e) {
        appData.skills = appData.skills.split(',').map(s => s.trim()).filter(s => s);
      }
    }
    if (typeof appData.languages === 'string') {
      try {
        appData.languages = JSON.parse(appData.languages);
      } catch (e) {
        appData.languages = appData.languages.split(',').map(l => l.trim()).filter(l => l);
      }
    }

    const application = await JobApplication.create(appData);
    res.status(201).json({ success: true, data: application });
  } catch (error) {
    console.error('Application submission error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error submitting application' });
  }
};

// @desc    Get all applications (Admin)
// @route   GET /api/applications
// @access  Private (Admin only)
const getAllApplications = async (req, res) => {
  try {
    const { search, qualification, experience } = req.query;
    let query = {};

    // Apply filters
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { preferredRole: { $regex: search, $options: 'i' } },
      ];
    }

    if (qualification) {
      query.qualification = { $regex: qualification, $options: 'i' };
    }

    if (experience) {
      query.experience = experience;
    }

    const applications = await JobApplication.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ success: false, message: 'Server error fetching applications' });
  }
};

// @desc    Delete a job application
// @route   DELETE /api/applications/:id
// @access  Private (Admin only)
const deleteApplication = async (req, res) => {
  try {
    const application = await JobApplication.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ success: false, message: 'Server error deleting application' });
  }
};

module.exports = {
  submitApplication,
  getAllApplications,
  deleteApplication,
};
