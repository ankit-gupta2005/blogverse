const express = require("express")
const router = express.Router()
const { 
  createBlog, 
  getAllBlogs, 
  getBlogById, 
  updateBlog, 
  deleteBlog, 
  getMyDrafts,
  toggleLike,
  getTrendingTopics 
} = require("../controllers/blogController")
const authMiddleware = require("../middleware/authMiddleware")
const upload = require("../middleware/multer")

router.post("/", authMiddleware, upload.fields([{ name: "coverImage" }, { name: "profileImage" }]), createBlog)
router.get("/", authMiddleware, getAllBlogs)

router.get("/trending", authMiddleware, getTrendingTopics);

router.get("/me/drafts", authMiddleware, getMyDrafts)
router.post("/like/:id", authMiddleware, toggleLike)
router.get("/:id", authMiddleware, getBlogById)
router.put("/:id", authMiddleware, upload.fields([{ name: "coverImage" }, { name: "profileImage" }]), updateBlog)
router.delete("/:id", authMiddleware, deleteBlog)

module.exports = router;