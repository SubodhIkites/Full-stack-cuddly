const { createError } = require('../utils/error');
const mongoose = require('mongoose');

// Validate create review request
exports.validateCreateReview = (req, res, next) => {
    const { productId, orderId, rating, title, comment, images } = req.body;

    if (!productId || !orderId || !rating || !title || !comment) {
        return next(createError(400, 'Please provide all required fields'));
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return next(createError(400, 'Invalid product ID'));
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return next(createError(400, 'Invalid order ID'));
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        return next(createError(400, 'Rating must be a number between 1 and 5'));
    }

    if (title.length < 3 || title.length > 100) {
        return next(createError(400, 'Title must be between 3 and 100 characters'));
    }

    if (comment.length < 10 || comment.length > 1000) {
        return next(createError(400, 'Comment must be between 10 and 1000 characters'));
    }

    if (images && !Array.isArray(images)) {
        return next(createError(400, 'Images must be an array'));
    }

    if (images && images.length > 5) {
        return next(createError(400, 'Maximum 5 images allowed'));
    }

    if (images) {
        const isValidUrl = images.every(url => /^https?:\/\/.+/.test(url));
        if (!isValidUrl) {
            return next(createError(400, 'All image URLs must be valid'));
        }
    }

    next();
};

// Validate update review request
exports.validateUpdateReview = (req, res, next) => {
    const { rating, title, comment, images } = req.body;

    if (rating && (typeof rating !== 'number' || rating < 1 || rating > 5)) {
        return next(createError(400, 'Rating must be a number between 1 and 5'));
    }

    if (title && (title.length < 3 || title.length > 100)) {
        return next(createError(400, 'Title must be between 3 and 100 characters'));
    }

    if (comment && (comment.length < 10 || comment.length > 1000)) {
        return next(createError(400, 'Comment must be between 10 and 1000 characters'));
    }

    if (images && !Array.isArray(images)) {
        return next(createError(400, 'Images must be an array'));
    }

    if (images && images.length > 5) {
        return next(createError(400, 'Maximum 5 images allowed'));
    }

    if (images) {
        const isValidUrl = images.every(url => /^https?:\/\/.+/.test(url));
        if (!isValidUrl) {
            return next(createError(400, 'All image URLs must be valid'));
        }
    }

    next();
};

// Validate review ID
exports.validateReviewId = (req, res, next) => {
    const { reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        return next(createError(400, 'Invalid review ID'));
    }

    next();
}; 