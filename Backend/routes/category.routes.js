const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");
const { validateObjectId } = require("../middleware/validation.middleware");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  updateCategoryOrder
} = require("../controllers/category.controller");

// Public routes
router.get("/", getCategories);
router.get("/:id", validateObjectId, getCategory);

// Protected routes (admin only)
router.post("/", verifyToken, isAdmin, createCategory);
router.put("/:id", verifyToken, isAdmin, validateObjectId, updateCategory);
router.delete("/:id", verifyToken, isAdmin, validateObjectId, deleteCategory);
router.patch("/order", verifyToken, isAdmin, updateCategoryOrder);

module.exports = router;
