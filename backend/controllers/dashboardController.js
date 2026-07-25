const BlogPost = require("../models/BlogPost");
const Comment = require("../models/Comment");

const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const posts = await BlogPost.find({ author: userId })
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    const totalLikes = posts.reduce((sum, post) => sum + post.likes.length, 0);

    const postIds = posts.map((p) => p._id);
    const totalComments = await Comment.countDocuments({ blogPost: { $in: postIds } });

    const postsWithMeta = posts.map((post) => ({
      _id: post._id,
      title: post.title,
      excerpt: post.content.replace(/<[^>]*>/g, "").slice(0, 100),
      category: post.category,
      likesCount: post.likes.length,
      createdAt: post.createdAt,
    }));

    res.json({
      posts: postsWithMeta,
      stats: {
        totalPosts: posts.length,
        totalLikes,
        totalComments,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboard };
