const Comment = require("../models/Comment");
const BlogPost = require("../models/BlogPost");

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ blogPost: req.params.blogId })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { blogId } = req.params;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const blog = await BlogPost.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    const comment = await Comment.create({
      text,
      author: req.user._id,
      blogPost: blogId,
    });

    const populated = await comment.populate("author", "name email");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getComments, createComment, deleteComment };
