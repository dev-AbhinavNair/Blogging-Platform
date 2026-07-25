const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getComments, createComment, deleteComment } = require("../controllers/commentController");

router.get("/:blogId", protect, getComments);
router.post("/:blogId", protect, createComment);
router.delete("/:id", protect, deleteComment);

module.exports = router;
