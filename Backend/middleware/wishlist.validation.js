const { createError } = require('../utils/error');
const mongoose = require('mongoose');

// Validate add to wishlist request
exports.validateAddToWishlist = (req, res, next) => {
    const { productId } = req.body;

    if (!productId) {
        return next(createError(400, 'Please provide product ID'));
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return next(createError(400, 'Invalid product ID'));
    }

    next();
};

// Validate remove from wishlist request
exports.validateRemoveFromWishlist = (req, res, next) => {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return next(createError(400, 'Invalid product ID'));
    }

    next();
}; 