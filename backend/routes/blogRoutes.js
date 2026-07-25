const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getBlogs, getBlog, createBlog, updateBlog, deleteBlog, toggleLike } = require("../controllers/blogController");

router.get("/", protect, getBlogs);
router.get("/:id", protect, getBlog);
router.post("/", protect, createBlog);
router.put("/:id", protect, updateBlog);
router.delete("/:id", protect, deleteBlog);
router.post("/:id/like", protect, toggleLike);

module.exports = router;
