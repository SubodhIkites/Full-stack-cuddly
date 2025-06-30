const Payment = require('../models/payment.model');
const Order = require('../models/order.model');
const { createError } = require('../utils/error');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create payment intent
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { orderId, paymentMethod } = req.body;

    // Get order details
    const order = await Order.findById(orderId);
    if (!order) {
      return next(createError(404, 'Order not found'));
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return next(createError(403, 'Not authorized to access this order'));
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ order: orderId });
    if (existingPayment) {
      return next(createError(400, 'Payment already exists for this order'));
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100), // Convert to paise
      currency: 'inr',
      payment_method_types: ['card', 'upi'],
      metadata: {
        orderId: order._id.toString(),
        userId: req.user._id.toString()
      }
    });

    // Create payment record
    const payment = await Payment.create({
      order: orderId,
      user: req.user._id,
      amount: order.totalAmount,
      paymentMethod,
      paymentDetails: {
        paymentIntentId: paymentIntent.id
      }
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id
    });
  } catch (error) {
    next(error);
  }
};

// Confirm payment
exports.confirmPayment = async (req, res, next) => {
  try {
    const { paymentId, paymentMethodId, upiId, bankName, walletName } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return next(createError(404, 'Payment not found'));
    }

    // Check if payment belongs to user
    if (payment.user.toString() !== req.user._id.toString()) {
      return next(createError(403, 'Not authorized to access this payment'));
    }

    // Confirm payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.confirm(
      payment.paymentDetails.paymentIntentId,
      {
        payment_method: paymentMethodId,
        payment_method_options: {
          upi: {
            mandate_options: {
              reference: `Order-${payment.order}`
            }
          }
        }
      }
    );

    // Update payment status and details
    await payment.updateStatus('completed');
    await payment.addPaymentDetails({
      paymentMethodId,
      last4: paymentIntent.payment_method_details?.card?.last4,
      brand: paymentIntent.payment_method_details?.card?.brand,
      receiptUrl: paymentIntent.charges.data[0].receipt_url,
      upiId,
      bankName,
      walletName
    });

    // Update order status
    const order = await Order.findById(payment.order);
    await order.updateStatus('processing');

    res.status(200).json({
      success: true,
      message: 'Payment confirmed successfully',
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

// Get payment details
exports.getPaymentDetails = async (req, res, next) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId)
      .populate('order', 'items totalAmount status')
      .populate('user', 'name email');

    if (!payment) {
      return next(createError(404, 'Payment not found'));
    }

    // Check if payment belongs to user
    if (payment.user._id.toString() !== req.user._id.toString()) {
      return next(createError(403, 'Not authorized to access this payment'));
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

// Process refund
exports.processRefund = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const { reason } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return next(createError(404, 'Payment not found'));
    }

    // Check if payment belongs to user
    if (payment.user.toString() !== req.user._id.toString()) {
      return next(createError(403, 'Not authorized to access this payment'));
    }

    // Process refund with Stripe
    const refund = await stripe.refunds.create({
      payment_intent: payment.paymentDetails.paymentIntentId,
      reason: reason || 'requested_by_customer'
    });

    // Update payment with refund details
    await payment.processRefund({
      refundId: refund.id,
      amount: refund.amount / 100, // Convert from paise
      reason: refund.reason,
      status: refund.status
    });

    // Update order status
    const order = await Order.findById(payment.order);
    await order.updateStatus('cancelled');

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      data: payment
    });
  } catch (error) {
    next(error);
  }
}; 