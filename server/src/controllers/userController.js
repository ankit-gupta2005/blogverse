const User = require("../models/User");
const Blog = require("../models/Blog");
const cloudinary = require("../config/cloudinary");
const bcrypt = require("bcryptjs");

exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user._id;
    const user = await User.findById(userId)
      .select("-password")
      .populate("followers", "name profileImage")
      .populate("following", "name profileImage");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, socialLinks } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (typeof bio === "string") user.bio = bio;

    if (socialLinks) {
      const parsedLinks = typeof socialLinks === "string" ? JSON.parse(socialLinks) : socialLinks;
      user.socialLinks = {
        twitter: parsedLinks.twitter || "",
        github: parsedLinks.github || "",
        website: parsedLinks.website || ""
      };
    }

    if (req.files) {
      const uploadToCloudinary = async (file, folder) => {
        const fileStr = file.buffer.toString("base64");
        const dataUri = `data:${file.mimetype};base64,${fileStr}`;
        const result = await cloudinary.uploader.upload(dataUri, { folder });
        return result.secure_url;
      };

      if (req.files.profileImage && req.files.profileImage[0]) {
        user.profileImage = await uploadToCloudinary(req.files.profileImage[0], "profiles");
      }
      if (req.files.profileBanner && req.files.profileBanner[0]) {
        user.profileBanner = await uploadToCloudinary(req.files.profileBanner[0], "banners");
      }
    }

    await user.save();
    const userObj = user.toObject();
    delete userObj.password;
    res.status(200).json(userObj);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    
    if (!isMatch) return res.status(400).json({ message: "Current password incorrect" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserBlogs = async (req, res) => {
  try {
    const userId = req.params.id;
    const blogs = await Blog.find({ author: userId, isPublished: true })
      .populate("author", "name email profileImage bio followers")
      .sort({ createdAt: -1 });
    res.status(200).json({ blogs });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyBlogs = async (req, res) => {
  try {
    const userId = req.user._id;
    const blogs = await Blog.find({ author: userId })
      .populate("author", "name email profileImage")
      .sort({ createdAt: -1 });
    res.status(200).json({ blogs });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.toggleSaveBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const user = await User.findById(req.user._id);
    const isSaved = user.savedBlogs.includes(blogId);

    if (isSaved) {
      user.savedBlogs = user.savedBlogs.filter(id => id.toString() !== blogId);
    } else {
      user.savedBlogs.push(blogId);
    }

    await user.save();
    res.status(200).json({ message: isSaved ? "Removed" : "Saved", savedBlogs: user.savedBlogs });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSavedBlogs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "savedBlogs",
      populate: { path: "author", select: "name profileImage" }
    });
    res.status(200).json(user.savedBlogs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.toggleFollow = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    if (targetUserId === currentUserId.toString()) return res.status(400).send();

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId);
      targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId.toString());
    } else {
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
    }

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({ isFollowing: !isFollowing, followersCount: targetUser.followers.length });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSuggestedUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const users = await User.find({ _id: { $nin: [...currentUser.following, req.user._id] } })
      .select("name profileImage email")
      .limit(4);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};