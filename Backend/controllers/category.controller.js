const Category = require("../models/category.model");
const { AppError } = require("../utils/errorHandler");
const { createError } = require('../utils/error');

// Get all categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// Get single category
exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return next(createError(404, 'Category not found'));
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// Create new category
exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(createError(400, 'Category name already exists'));
    }
    next(error);
  }
};

// Update category
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return next(createError(404, 'Category not found'));
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(createError(400, 'Category name already exists'));
    }
    next(error);
  }
};

// Delete category
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return next(createError(404, 'Category not found'));
    }

    // Check if category has subcategories
    const hasSubcategories = await Category.exists({ parent: category._id });
    if (hasSubcategories) {
      return next(createError(400, 'Cannot delete category with subcategories'));
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get category hierarchy
exports.getCategoryHierarchy = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true, parent: null })
      .populate({
        path: 'subcategories',
        match: { isActive: true },
        populate: {
          path: 'subcategories',
          match: { isActive: true }
        }
      });

    res.status(200).json({
      success: true,
      categories
    });
  } catch (error) {
    next(error);
  }
};

// Update category order
exports.updateCategoryOrder = async (req, res, next) => {
  try {
    const { order } = req.body;
    
    if (!Array.isArray(order)) {
      return next(createError(400, 'Order must be an array of category IDs'));
    }

    // Update order for each category
    const updatePromises = order.map((categoryId, index) => 
      Category.findByIdAndUpdate(categoryId, { order: index })
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'Category order updated successfully'
    });
  } catch (error) {
    next(error);
  }
};