const BlogPost = require("../models/BlogPost");

const getBlogs = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    const total = await BlogPost.countDocuments(filter);
    const blogs = await BlogPost.find(filter)
      .populate("author", "name email")
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const blogsWithMeta = blogs.map((blog) => ({
      _id: blog._id,
      title: blog.title,
      excerpt: blog.content.replace(/<[^>]*>/g, "").slice(0, 150),
      author: blog.author,
      category: blog.category,
      likesCount: blog.likes.length,
      likedBy: blog.likes,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    }));

    res.json({ blogs: blogsWithMeta, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBlog = async (req, res) => {
  try {
    const blog = await BlogPost.findById(req.params.id)
      .populate("author", "name email")
      .populate("category", "name slug");

    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBlog = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ message: "Title, content, and category are required" });
    }

    const blog = await BlogPost.create({
      title,
      content,
      category,
      author: req.user._id,
    });

    const populated = await blog.populate([
      { path: "author", select: "name email" },
      { path: "category", select: "name slug" },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    const blog = await BlogPost.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this post" });
    }

    const { title, content, category } = req.body;
    if (title) blog.title = title;
    if (content) blog.content = content;
    if (category) blog.category = category;

    await blog.save();

    const populated = await blog.populate([
      { path: "author", select: "name email" },
      { path: "category", select: "name slug" },
    ]);

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await BlogPost.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleLike = async (req, res) => {
  try {
    const blog = await BlogPost.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    const userId = req.user._id;
    const index = blog.likes.indexOf(userId);

    if (index === -1) {
      blog.likes.push(userId);
    } else {
      blog.likes.splice(index, 1);
    }

    await blog.save();

    res.json({
      likesCount: blog.likes.length,
      liked: index === -1,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBlogs, getBlog, createBlog, updateBlog, deleteBlog, toggleLike };
