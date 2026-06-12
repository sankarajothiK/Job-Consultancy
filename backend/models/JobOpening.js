const mongoose = require('mongoose');

const jobOpeningSchema = new mongoose.Schema({
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
  vacancyCount: {
    type: Number,
    required: [true, 'Vacancy count is required'],
  },
  salaryPackage: {
    type: String,
    required: [true, 'Salary package is required'],
    trim: true,
  },
  shiftTiming: {
    type: String,
    required: [true, 'Shift timing is required'],
    trim: true,
  },
  workType: {
    type: String,
    enum: ['WFH', 'Office', 'Hybrid'],
    required: [true, 'Work type is required'],
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
  experience: {
    type: String,
    required: [true, 'Experience required is required'],
    trim: true,
  },
  requiredSkills: {
    type: [String],
    default: [],
  },
  jobDescription: {
    type: String,
    required: [true, 'Job description is required'],
  },
  benefits: {
    type: String,
    default: '',
  },
  lastDateToApply: {
    type: Date,
    required: [true, 'Last date to apply is required'],
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('JobOpening', jobOpeningSchema);
