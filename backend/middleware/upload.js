const multer = require('multer');

// Configure memory storage
const storage = multer.memoryStorage();

// File validation helper (checks for image vs document)
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'resume' || file.fieldname === 'offerLetter') {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF format is allowed for resumes/offer letters'), false);
    }
  } else if (file.fieldname === 'candidatePhoto') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image formats (JPEG, PNG, WEBP) are allowed for photos'), false);
    }
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

module.exports = upload;
