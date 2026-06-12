const cloudinary = require('cloudinary').v2;

const isConfigured = () => {
  return (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloudinary_cloud_name' &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_KEY !== 'your_cloudinary_api_key' &&
    process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_API_SECRET !== 'your_cloudinary_api_secret'
  );
};

if (isConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log("Cloudinary configuration loaded successfully.");
} else {
  console.warn("WARNING: Cloudinary is not configured correctly. Using mock file upload fallback.");
}

const uploadToCloudinary = (fileBuffer, folder, filename = '', resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    if (!isConfigured()) {
      console.log(`[MOCK UPLOAD] Simulating upload for file: "${filename}" to folder: "${folder}"`);
      // If it's a PDF or raw file, return a sample PDF url
      if (filename.toLowerCase().endsWith('.pdf') || folder.includes('resume') || folder.includes('offer')) {
        return resolve(`https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`);
      } else {
        // Return a mock photo placeholder
        const seed = Math.floor(Math.random() * 1000);
        return resolve(`https://picsum.photos/seed/${seed}/400/400`);
      }
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: resourceType,
        public_id: filename ? filename.split('.')[0] + '_' + Date.now() : undefined,
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  isConfigured,
};
