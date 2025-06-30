const { createError } = require('../utils/error');
const mongoose = require('mongoose');

// Validate add to cart request
exports.validateAddToCart = (req, res, next) => {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
        return next(createError(400, 'Please provide product ID and quantity'));
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return next(createError(400, 'Invalid product ID'));
    }

    if (typeof quantity !== 'number' || quantity < 1) {
        return next(createError(400, 'Quantity must be a positive number'));
    }

    next();
};

// Validate update cart item request
exports.validateUpdateCartItem = (req, res, next) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return next(createError(400, 'Invalid product ID'));
    }

    if (!quantity) {
        return next(createError(400, 'Please provide quantity'));
    }

    if (typeof quantity !== 'number' || quantity < 1) {
        return next(createError(400, 'Quantity must be a positive number'));
    }

    next();
};

// Validate remove from cart request
exports.validateRemoveFromCart = (req, res, next) => {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return next(createError(400, 'Invalid product ID'));
    }

    next();
}; 