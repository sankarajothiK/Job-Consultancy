const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
  },
  whatsapp: {
    type: String,
    required: [true, 'WhatsApp number is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    trim: true,
    lowercase: true,
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
  },
  dob: {
    type: Date,
    required: [true, 'Date of birth is required'],
  },
  qualification: {
    type: String,
    required: [true, 'Qualification is required'],
    trim: true,
  },
  collegeName: {
    type: String,
    required: [true, 'College name is required'],
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
  location: {
    type: String,
    required: [true, 'Current location is required'],
    trim: true,
  },
  preferredRole: {
    type: String,
    required: [true, 'Preferred job role is required'],
    trim: true,
  },
  customJobRole: {
    type: String,
    default: '',
  },
  preferredCompanies: {
    type: String,
    default: '',
  },
  experience: {
    type: String,
    enum: ['Fresher', 'Experienced'],
    required: [true, 'Experience level is required'],
  },
  experienceDetails: {
    type: String,
    default: '',
  },
  currentCompany: {
    type: String,
    default: '',
  },
  currentSalary: {
    type: String,
    default: '',
  },
  expectedSalary: {
    type: String,
    default: '',
  },
  skills: {
    type: [String],
    default: [],
  },
  languages: {
    type: [String],
    default: [],
  },
  resumeUrl: {
    type: String,
    required: [true, 'Resume URL is required'],
  },
  notes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
