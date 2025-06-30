const { createError } = require('../utils/error');
const mongoose = require('mongoose');

// Validate create order request
exports.validateCreateOrder = (req, res, next) => {
    const { shippingAddress, paymentInfo } = req.body;

    if (!shippingAddress) {
        return next(createError(400, 'Please provide shipping address'));
    }

    const { street, city, state, country, zipCode } = shippingAddress;
    if (!street || !city || !state || !country || !zipCode) {
        return next(createError(400, 'Please provide complete shipping address'));
    }

    if (!paymentInfo) {
        return next(createError(400, 'Please provide payment information'));
    }

    next();
};

// Validate order ID
exports.validateOrderId = (req, res, next) => {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return next(createError(400, 'Invalid order ID'));
    }

    next();
};

// Validate update order status request
exports.validateUpdateStatus = (req, res, next) => {
    const { status } = req.body;

    if (!status) {
        return next(createError(400, 'Please provide order status'));
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
        return next(createError(400, 'Invalid order status'));
    }

    next();
};

// Validate tracking information
exports.validateTrackingInfo = (req, res, next) => {
    const { trackingNumber, estimatedDelivery } = req.body;

    if (!trackingNumber) {
        return next(createError(400, 'Please provide tracking number'));
    }

    if (!estimatedDelivery) {
        return next(createError(400, 'Please provide estimated delivery date'));
    }

    if (isNaN(Date.parse(estimatedDelivery))) {
        return next(createError(400, 'Invalid estimated delivery date'));
    }

    next();
}; 