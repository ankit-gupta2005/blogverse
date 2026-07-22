const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      default: "",
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Tracks total view count
    views: {
      type: Number,
      default: 0,
    },
    // Array of view events for time-series charts in Recharts
    viewLogs: [
      {
        timestamp: { type: Date, default: Date.now },
        viewerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

blogSchema.virtual("likeCount").get(function () {
  return this.likes ? this.likes.length : 0;
});

module.exports = mongoose.model("Blog", blogSchema);
