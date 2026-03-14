const Blog = require("../models/Blog");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const Comment = require("../models/Comment");

const uploadBufferToCloudinary = async (file) => {
  if (!file || !file.buffer) return null;
  const fileStr = file.buffer.toString("base64");
  const dataUri = `data:${file.mimetype};base64,${fileStr}`;
  const result = await cloudinary.uploader.upload(dataUri, { folder: "blogs" });
  return result?.secure_url || null;
};

exports.createBlog = async (req, res) => {
  try {
    const { title, content, isPublished } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and Content are required" });
    }
    let coverImageUrl = req.body.coverImage || "";
    if (req.files?.coverImage?.length > 0) {
      coverImageUrl = await uploadBufferToCloudinary(req.files.coverImage[0]);
    }
    const blog = await Blog.create({
      title,
      content,
      coverImage: coverImageUrl,
      author: req.user._id,
      isPublished: !!isPublished,
    });
    res.status(201).json(blog);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const search = req.query.search || "";
    const limit = 10;
    const skip = (page - 1) * limit;

    let query = { isPublished: true };

    if (search) {
      const matchedUsers = await User.find({
        name: { $regex: search, $options: "i" }
      }).select("_id");
      
      const authorIds = matchedUsers.map(u => u._id);

      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $in: authorIds } }
      ];
    }

    const totalBlogs = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .populate("author", "name email profileImage bio followers")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const blogsWithStats = await Promise.all(
      blogs.map(async (blog) => {
        const commentCount = await Comment.countDocuments({ blogId: blog._id });
        return { ...blog, commentCount };
      })
    );

    res.json({
      blogs: blogsWithStats,
      currentPage: page,
      totalPages: Math.ceil(totalBlogs / limit),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "name email profileImage bio followers");

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (!blog.isPublished && (!req.user || blog.author._id.toString() !== req.user._id.toString())) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(blog);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { title, content, isPublished } = req.body;
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    blog.title = title ?? blog.title;
    blog.content = content ?? blog.content;
    blog.isPublished = isPublished ?? blog.isPublished;
    if (req.files?.coverImage?.length > 0) {
      const coverUrl = await uploadBufferToCloudinary(req.files.coverImage[0]);
      if (coverUrl) blog.coverImage = coverUrl;
    }
    await blog.save();
    res.status(200).json(blog);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await blog.deleteOne();
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyDrafts = async (req, res) => {
  try {
    const userId = req.user._id;
    const blogs = await Blog.find({ author: userId, isPublished: false })
      .populate("author", "name email profileImage followers")
      .sort({ createdAt: -1 });
    res.status(200).json({ blogs });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const isLiked = blog.likes.includes(req.user._id);

    if (isLiked) {
      blog.likes = blog.likes.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      blog.likes.push(req.user._id);
    }

    await blog.save();
    res.status(200).json({
      message: isLiked ? "Unliked" : "Liked",
      likes: blog.likes,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTrendingTopics = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).select("title");
    
    const wordCounts = {};
    const commonWords = ["the", "and", "how", "for", "with", "what", "this", "your", "that"];

    blogs.forEach(blog => {
      const words = blog.title.toLowerCase().split(/\s+/);
      words.forEach(word => {
        const cleanWord = word.replace(/[^a-z0-9]/g, "");
        if (cleanWord.length > 3 && !commonWords.includes(cleanWord)) {
          wordCounts[cleanWord] = (wordCounts[cleanWord] || 0) + 1;
        }
      });
    });

    const trending = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }));

    res.status(200).json(trending);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

