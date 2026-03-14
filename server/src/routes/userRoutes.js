const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { 
  updateProfile, 
  getUserBlogs, 
  getMyBlogs, 
  getProfile,
  toggleSaveBlog,
  getSavedBlogs,
  toggleFollow,
  updatePassword,
  getSuggestedUsers 
} = require("../controllers/userController");
const upload = require("../middleware/multer");

router.get("/profile", authMiddleware, getProfile);
router.get("/profile/:id", getProfile);
router.put(
  "/profile", 
  authMiddleware, 
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "profileBanner", maxCount: 1 }
  ]), 
  updateProfile
);

router.get("/suggested", authMiddleware, getSuggestedUsers); 
router.get("/:id/blogs", getUserBlogs);
router.get("/me/blogs", authMiddleware, getMyBlogs);

router.post("/save/:blogId", authMiddleware, toggleSaveBlog);
router.put("/update-password", authMiddleware, updatePassword);
router.get("/saved-blogs", authMiddleware, getSavedBlogs);

router.post("/follow/:id", authMiddleware, toggleFollow);

module.exports = router;