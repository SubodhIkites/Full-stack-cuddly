const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { validateObjectId } = require('../middleware/validation.middleware');

// Public routes
router.get('/product/:productId', validateObjectId, reviewController.getProductReviews);

// Protected routes
router.use(verifyToken);

// Create review
router.post('/', reviewController.createReview);

// Get user reviews
router.get('/user', reviewController.getUserReviews);

// Update review
router.patch('/:reviewId', validateObjectId, reviewController.updateReview);

// Delete review
router.delete('/:reviewId', validateObjectId, reviewController.deleteReview);

// Mark review as helpful
router.post('/:reviewId/helpful', validateObjectId, reviewController.markHelpful);

// Unmark review as helpful
router.delete('/:reviewId/helpful', validateObjectId, reviewController.unmarkHelpful);

module.exports = router;