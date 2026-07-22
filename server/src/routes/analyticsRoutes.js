const express = require("express");
const router = express.Router();
const {
  getCreatorAnalytics,
  getRFMSegmentation,
} = require("../controllers/analyticsController");
const authMiddleware = require("../middleware/authMiddleware");

// Route for creator dashboard stats
router.get("/creator", authMiddleware, getCreatorAnalytics);

// Route for admin RFM cohort segmentation
router.get("/rfm-cohorts", authMiddleware, getRFMSegmentation);

module.exports = router;
