const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const { createError } = require('../utils/error');

// Helper function to calculate total amount
const calculateTotalAmount = (items) => {
  if (!items || items.length === 0) return 0;
  return parseFloat(items.reduce((sum, item) => {
    const itemTotal = parseFloat((item.price * item.quantity).toFixed(2));
    return parseFloat((sum + itemTotal).toFixed(2));
  }, 0).toFixed(2));
};

// Get user's cart
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price images stock');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Ensure total amount is correctly calculated
    cart.totalAmount = calculateTotalAmount(cart.items);
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

// Add item to cart
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    // Check if product exists and has enough stock
    const product = await Product.findById(productId);
    if (!product) {
      return next(createError(404, 'Product not found'));
    }

    if (product.stock < quantity) {
      return next(createError(400, 'Not enough stock available'));
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Add item to cart
    await cart.addItem(productId, quantity, product.price);

    // Populate product details
    await cart.populate('items.product', 'name price images stock');

    // Ensure total amount is correctly calculated
    cart.totalAmount = calculateTotalAmount(cart.items);
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return next(createError(400, 'Quantity must be at least 1'));
    }

    // Check product stock
    const product = await Product.findById(productId);
    if (!product) {
      return next(createError(404, 'Product not found'));
    }

    if (product.stock < quantity) {
      return next(createError(400, 'Not enough stock available'));
    }

    // Update cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return next(createError(404, 'Cart not found'));
    }

    await cart.updateItemQuantity(productId, quantity);
    await cart.populate('items.product', 'name price images stock');

    // Ensure total amount is correctly calculated
    cart.totalAmount = calculateTotalAmount(cart.items);
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return next(createError(404, 'Cart not found'));
    }

    await cart.removeItem(productId);
    await cart.populate('items.product', 'name price images stock');

    // Ensure total amount is correctly calculated
    cart.totalAmount = calculateTotalAmount(cart.items);
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

// Clear cart
exports.clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return next(createError(404, 'Cart not found'));
    }

    await cart.clearCart();

    // Ensure total amount is correctly calculated
    cart.totalAmount = calculateTotalAmount(cart.items);
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: cart
    });
  } catch (error) {
    next(error);
  }
}; 