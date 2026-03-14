const Comment = require("../models/Comment");

exports.addComment = async (req, res) => {
  try {
    const { content, blogId } = req.body;
    const comment = await Comment.create({
      content,
      blogId,
      author: req.user._id
    });
    
    const populatedComment = await comment.populate("author", "name profileImage");
    res.status(201).json(populatedComment);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getBlogComments = async (req, res) => {
  try {
    const comments = await Comment.find({ blogId: req.params.blogId })
      .populate("author", "name profileImage")
      .sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Not found" });
    
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await comment.deleteOne();
    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};