const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
    createPaymentIntent,
    confirmPayment,
    getPaymentHistory,
    getPaymentById,
    refundPayment
} = require('../controllers/payment.controller');

// All payment routes require authentication
router.use(authenticateToken);

// Create payment intent
router.post('/create-intent', createPaymentIntent);

// Confirm payment
router.post('/confirm', confirmPayment);

// Get payment history
router.get('/history', getPaymentHistory);

// Get specific payment
router.get('/:paymentId', getPaymentById);

// Refund payment
router.post('/:paymentId/refund', refundPayment);

module.exports = router; 