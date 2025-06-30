const Review = require('../models/review.model');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const { createError } = require('../utils/error');

// Create review
exports.createReview = async (req, res, next) => {
  try {
    const { productId, orderId, rating, title, comment, images } = req.body;

    // Check if order exists and belongs to user
    const order = await Order.findById(orderId);
    if (!order) {
      return next(createError(404, 'Order not found'));
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return next(createError(403, 'Not authorized to review this order'));
    }

    // Check if product exists in order
    const productInOrder = order.items.find(item => 
      item.product.toString() === productId
    );
    if (!productInOrder) {
      return next(createError(400, 'Product not found in order'));
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ order: orderId, product: productId });
    if (existingReview) {
      return next(createError(400, 'Review already exists for this product in this order'));
    }

    // Create review
    const review = await Review.create({
      user: req.user._id,
      product: productId,
      order: orderId,
      rating,
      title,
      comment,
      images,
      isVerifiedPurchase: true
    });

    // Update product average rating
    const { averageRating, totalReviews } = await Review.getAverageRating(productId);
    await Product.findByIdAndUpdate(productId, {
      averageRating,
      totalReviews
    });

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// Get product reviews
exports.getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const reviews = await Review.find({ product: productId, status: 'approved' })
      .populate('user', 'name')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ product: productId, status: 'approved' });

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user reviews
exports.getUserReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('product', 'name images')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// Update review
exports.updateReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, comment, images } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return next(createError(404, 'Review not found'));
    }

    // Check if review belongs to user
    if (review.user.toString() !== req.user._id.toString()) {
      return next(createError(403, 'Not authorized to update this review'));
    }

    // Update review
    review.rating = rating || review.rating;
    review.title = title || review.title;
    review.comment = comment || review.comment;
    review.images = images || review.images;
    review.status = 'pending'; // Reset status for moderation
    await review.save();

    // Update product average rating
    const { averageRating, totalReviews } = await Review.getAverageRating(review.product);
    await Product.findByIdAndUpdate(review.product, {
      averageRating,
      totalReviews
    });

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// Delete review
exports.deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return next(createError(404, 'Review not found'));
    }

    // Check if review belongs to user
    if (review.user.toString() !== req.user._id.toString()) {
      return next(createError(403, 'Not authorized to delete this review'));
    }

    await review.deleteOne();

    // Update product average rating
    const { averageRating, totalReviews } = await Review.getAverageRating(review.product);
    await Product.findByIdAndUpdate(review.product, {
      averageRating,
      totalReviews
    });

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Mark review as helpful
exports.markHelpful = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return next(createError(404, 'Review not found'));
    }

    await review.markHelpful(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Review marked as helpful',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// Unmark review as helpful
exports.unmarkHelpful = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return next(createError(404, 'Review not found'));
    }

    await review.unmarkHelpful(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Review unmarked as helpful',
      data: review
    });
  } catch (error) {
    next(error);
  }
}; 