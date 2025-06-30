const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const { validateObjectId } = require('../middleware/validation.middleware');

// All order routes require authentication
router.use(verifyToken);

// Create new order
router.post('/', orderController.createOrder);

// Get user's orders
router.get('/', orderController.getUserOrders);

// Get single order
router.get('/:orderId', validateObjectId, orderController.getOrder);

// Update order status (admin only)
router.patch('/:orderId/status', isAdmin, validateObjectId, orderController.updateOrderStatus);

// Add tracking information (admin only)
router.patch('/:orderId/tracking', isAdmin, validateObjectId, orderController.addTrackingInfo);

// Cancel order
router.delete('/:orderId', validateObjectId, orderController.cancelOrder);

module.exports = router;