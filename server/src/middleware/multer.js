const multer = require("multer");

// use memory storage so we can upload buffer directly to Cloudinary
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;
