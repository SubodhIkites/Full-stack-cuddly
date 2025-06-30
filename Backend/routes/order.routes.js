const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder
} = require('../controllers/order.controller');

// All order routes require authentication
router.use(authenticateToken);

// Create new order
router.post('/', createOrder);

// Get all orders for the user
router.get('/', getOrders);

// Get specific order by ID
router.get('/:orderId', getOrderById);

// Update order status (admin only)
router.patch('/:orderId/status', updateOrderStatus);

// Cancel order
router.delete('/:orderId', cancelOrder);

module.exports = router; 