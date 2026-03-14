const express = require("express");
const router = express.Router();
const { addComment, getBlogComments, deleteComment } = require("../controllers/commentController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, addComment);
router.get("/:blogId", getBlogComments);
router.delete("/:id", authMiddleware, deleteComment);

module.exports = router;