const Blog = require("../models/Blog");
const User = require("../models/User");
const Comment = require("../models/Comment");
const mongoose = require("mongoose");


exports.getCreatorAnalytics = async (req, res) => {
  try {
    const authorId = req.user._id;


    const stats = await Blog.aggregate([
      { $match: { author: new mongoose.Types.ObjectId(authorId) } },
      {
        $group: {
          _id: null,
          totalBlogs: { $sum: 1 },
          totalViews: { $sum: "$views" },
          totalLikes: { $sum: { $size: { $ifNull: ["$likes", []] } } },
        },
      },
    ]);


    const timeSeriesViews = await Blog.aggregate([
      { $match: { author: new mongoose.Types.ObjectId(authorId) } },
      { $unwind: "$viewLogs" },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$viewLogs.timestamp" },
          },
          dailyViews: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const summary = stats[0] || { totalBlogs: 0, totalViews: 0, totalLikes: 0 };

    res.status(200).json({
      success: true,
      summary,
      chartData: timeSeriesViews,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching analytics" });
  }
};


exports.getRFMSegmentation = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const rfmCohorts = await User.aggregate([
      {
        $lookup: {
          from: "blogs",
          localField: "_id",
          foreignField: "author",
          as: "authoredBlogs",
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          lastLogin: 1,
          loginCount: 1,
          blogCount: { $size: "$authoredBlogs" },
          cohort: {
            $cond: {
              // Power User: Login count >= 5 OR created at least 3 blogs
              if: {
                $or: [
                  { $gte: ["$loginCount", 5] },
                  { $gte: [{ $size: "$authoredBlogs" }, 3] },
                ],
              },
              then: "Power User",
              else: {
                // At-Risk: Inactive for over 30 days
                $cond: {
                  if: { $lt: ["$lastLogin", thirtyDaysAgo] },
                  then: "At-Risk User",
                  else: "Casual Reader",
                },
              },
            },
          },
        },
      },
      {
        $group: {
          _id: "$cohort",
          count: { $sum: 1 },
          users: {
            $push: {
              name: "$name",
              email: "$email",
              lastLogin: "$lastLogin",
            },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      rfmCohorts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error executing RFM pipeline" });
  }
};
