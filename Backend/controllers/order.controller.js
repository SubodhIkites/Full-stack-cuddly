const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const { createError } = require('../utils/error');

// Create new order
exports.createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentInfo } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      return next(createError(400, 'Cart is empty'));
    }

    // Check stock availability and create order items
    const orderItems = [];
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      
      if (!product) {
        return next(createError(404, `Product not found: ${item.product._id}`));
      }

      if (product.stock < item.quantity) {
        return next(createError(400, `Insufficient stock for product: ${product.name}`));
      }

      // Update product stock
      product.stock -= item.quantity;
      await product.save();

      orderItems.push({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price
      });
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentInfo,
      totalAmount: cart.totalAmount
    });

    // Clear cart after successful order
    await cart.clearCart();

    // Populate order details
    await order.populate('items.product', 'name price images');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// Get user's orders
exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name price images')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// Get single order
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('items.product', 'name price images');

    if (!order) {
      return next(createError(404, 'Order not found'));
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return next(createError(403, 'Not authorized to access this order'));
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return next(createError(404, 'Order not found'));
    }

    await order.updateStatus(status);

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// Add tracking information (admin only)
exports.addTrackingInfo = async (req, res, next) => {
  try {
    const { trackingNumber, estimatedDelivery } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return next(createError(404, 'Order not found'));
    }

    await order.addTracking(trackingNumber, estimatedDelivery);

    res.status(200).json({
      success: true,
      message: 'Tracking information added successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// Cancel order
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return next(createError(404, 'Order not found'));
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return next(createError(403, 'Not authorized to cancel this order'));
    }

    await order.cancelOrder();

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
}; 