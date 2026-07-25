const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getCategories, createCategory } = require("../controllers/categoryController");

router.get("/", protect, getCategories);
router.post("/", protect, createCategory);

module.exports = router;
