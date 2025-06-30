const { createError } = require('../utils/error');
const mongoose = require('mongoose');

// Validate category creation/update
exports.validateCategory = (req, res, next) => {
    const { name, image } = req.body;

    if (!name || !image) {
        return next(createError(400, 'Please provide name and image'));
    }

    if (name.length < 2) {
        return next(createError(400, 'Category name must be at least 2 characters long'));
    }

    if (name.length > 50) {
        return next(createError(400, 'Category name cannot exceed 50 characters'));
    }

    if (req.body.description && req.body.description.length > 200) {
        return next(createError(400, 'Description cannot exceed 200 characters'));
    }

    if (req.body.parent && !mongoose.Types.ObjectId.isValid(req.body.parent)) {
        return next(createError(400, 'Invalid parent category ID'));
    }

    next();
};

// Validate category ID
exports.validateCategoryId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(createError(400, 'Invalid category ID'));
    }
    next();
};

// Validate category order update
exports.validateCategoryOrder = (req, res, next) => {
    const { order } = req.body;

    if (!Array.isArray(order)) {
        return next(createError(400, 'Order must be an array of category IDs'));
    }

    if (order.length === 0) {
        return next(createError(400, 'Order array cannot be empty'));
    }

    for (const categoryId of order) {
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return next(createError(400, 'Invalid category ID in order array'));
        }
    }

    next();
}; 