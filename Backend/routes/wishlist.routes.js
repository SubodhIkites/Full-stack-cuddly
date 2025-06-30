const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// All wishlist routes require authentication
router.use(verifyToken);

// Get user's wishlist
router.get('/', wishlistController.getWishlist);

// Add item to wishlist
router.post('/add', wishlistController.addToWishlist);

// Remove item from wishlist
router.delete('/remove/:productId', wishlistController.removeFromWishlist);

// Clear entire wishlist
router.delete('/clear', wishlistController.clearWishlist);

module.exports = router;