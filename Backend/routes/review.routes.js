const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview,
    getReviewById
} = require('../controllers/review.controller');

// Public routes
router.get('/product/:productId', getProductReviews);
router.get('/:reviewId', getReviewById);

// Protected routes
router.use(authenticateToken);
router.post('/', createReview);
router.put('/:reviewId', updateReview);
router.delete('/:reviewId', deleteReview);

module.exports = router; 