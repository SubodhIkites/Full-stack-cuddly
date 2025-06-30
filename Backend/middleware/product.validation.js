const { createError } = require('../utils/error');
const mongoose = require('mongoose');

// Validate product creation/update
exports.validateProduct = (req, res, next) => {
    const { name, description, price, category, images, stock } = req.body;

    if (!name || !description || !price || !category || !images || !stock) {
        return next(createError(400, 'Please provide all required fields'));
    }

    if (name.length < 3) {
        return next(createError(400, 'Product name must be at least 3 characters long'));
    }

    if (description.length < 10) {
        return next(createError(400, 'Description must be at least 10 characters long'));
    }

    if (price < 0) {
        return next(createError(400, 'Price cannot be negative'));
    }

    if (stock < 0) {
        return next(createError(400, 'Stock cannot be negative'));
    }

    if (!Array.isArray(images) || images.length === 0) {
        return next(createError(400, 'Please provide at least one product image'));
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
        return next(createError(400, 'Invalid category ID'));
    }

    next();
};

// Validate product ID
exports.validateProductId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(createError(400, 'Invalid product ID'));
    }
    next();
};

// Validate stock update
exports.validateStockUpdate = (req, res, next) => {
    const { quantity } = req.body;

    if (quantity === undefined) {
        return next(createError(400, 'Please provide quantity'));
    }

    if (typeof quantity !== 'number') {
        return next(createError(400, 'Quantity must be a number'));
    }

    next();
};