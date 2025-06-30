const { createError } = require('../utils/error');
const mongoose = require('mongoose');

// Validate create payment intent request
exports.validateCreatePaymentIntent = (req, res, next) => {
    const { orderId, paymentMethod } = req.body;

    if (!orderId || !paymentMethod) {
        return next(createError(400, 'Please provide order ID and payment method'));
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return next(createError(400, 'Invalid order ID'));
    }

    const validPaymentMethods = ['credit_card', 'debit_card', 'upi', 'net_banking', 'wallet'];
    if (!validPaymentMethods.includes(paymentMethod)) {
        return next(createError(400, 'Invalid payment method'));
    }

    next();
};

// Validate confirm payment request
exports.validateConfirmPayment = (req, res, next) => {
    const { paymentId, paymentMethodId, upiId, bankName, walletName } = req.body;

    if (!paymentId) {
        return next(createError(400, 'Please provide payment ID'));
    }

    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
        return next(createError(400, 'Invalid payment ID'));
    }

    // Validate payment method specific fields
    if (req.body.paymentMethod === 'upi' && !upiId) {
        return next(createError(400, 'Please provide UPI ID'));
    }

    if (req.body.paymentMethod === 'net_banking' && !bankName) {
        return next(createError(400, 'Please provide bank name'));
    }

    if (req.body.paymentMethod === 'wallet' && !walletName) {
        return next(createError(400, 'Please provide wallet name'));
    }

    if (['credit_card', 'debit_card'].includes(req.body.paymentMethod) && !paymentMethodId) {
        return next(createError(400, 'Please provide payment method ID'));
    }

    next();
};

// Validate payment ID
exports.validatePaymentId = (req, res, next) => {
    const { paymentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
        return next(createError(400, 'Invalid payment ID'));
    }

    next();
};

// Validate refund request
exports.validateRefund = (req, res, next) => {
    const { reason } = req.body;

    if (reason && typeof reason !== 'string') {
        return next(createError(400, 'Refund reason must be a string'));
    }

    const validReasons = ['requested_by_customer', 'duplicate', 'fraudulent'];
    if (reason && !validReasons.includes(reason)) {
        return next(createError(400, 'Invalid refund reason'));
    }

    next();
}; 