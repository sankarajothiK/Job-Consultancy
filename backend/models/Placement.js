const mongoose = require('mongoose');

const placementSchema = new mongoose.Schema({
  candidateName: {
    type: String,
    required: [true, 'Candidate name is required'],
    trim: true,
  },
  candidatePhoto: {
    type: String,
    default: '',
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  jobRole: {
    type: String,
    required: [true, 'Job role is required'],
    trim: true,
  },
  salaryPackage: {
    type: String,
    required: [true, 'Salary package is required'],
    trim: true,
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  qualification: {
    type: String,
    required: [true, 'Qualification is required'],
    trim: true,
  },
  yearOfPassing: {
    type: String,
    required: [true, 'Year of passing is required'],
  },
  cgpa: {
    type: String,
    required: [true, 'CGPA / Percentage is required'],
    trim: true,
  },
  joiningDate: {
    type: Date,
    required: [true, 'Joining date is required'],
  },
  feedback: {
    type: String,
    required: [true, 'Candidate feedback is required'],
  },
  successStory: {
    type: String,
    required: [true, 'Success story is required'],
  },
  offerLetter: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Placement', placementSchema);
