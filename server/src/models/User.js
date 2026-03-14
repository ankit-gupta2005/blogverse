const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    default: ""
  },
  profileBanner: {
    type: String,
    default: ""
  },
  bio: {
    type: String,
    default: ""
  },
  socialLinks: {
    twitter: { type: String, default: "" },
    github: { type: String, default: "" },
    website: { type: String, default: "" }
  },
  savedBlogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog"
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);