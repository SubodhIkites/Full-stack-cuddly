const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { validateObjectId } = require('../middleware/validation.middleware');

// All payment routes require authentication
router.use(verifyToken);

// Create payment intent
router.post('/create-intent', paymentController.createPaymentIntent);

// Confirm payment
router.post('/confirm', paymentController.confirmPayment);

// Get payment details
router.get('/:paymentId', validateObjectId, paymentController.getPaymentDetails);

// Process refund
router.post('/:paymentId/refund', validateObjectId, paymentController.processRefund);

module.exports = router;