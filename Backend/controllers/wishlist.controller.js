const Wishlist = require('../models/wishlist.model');
const Product = require('../models/product.model');
const { createError } = require('../utils/error');

// Get user's wishlist
exports.getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate('products', 'name price images stock');

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    res.status(200).json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    next(error);
  }
};

// Add product to wishlist
exports.addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return next(createError(404, 'Product not found'));
    }

    // Get or create wishlist
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    // Check if product is already in wishlist
    if (wishlist.hasProduct(productId)) {
      return next(createError(400, 'Product already in wishlist'));
    }

    // Add product to wishlist
    await wishlist.addProduct(productId);
    await wishlist.populate('products', 'name price images stock');

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
      data: wishlist
    });
  } catch (error) {
    next(error);
  }
};

// Remove product from wishlist
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return next(createError(404, 'Wishlist not found'));
    }

    // Check if product is in wishlist
    if (!wishlist.hasProduct(productId)) {
      return next(createError(404, 'Product not found in wishlist'));
    }

    await wishlist.removeProduct(productId);
    await wishlist.populate('products', 'name price images stock');

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      data: wishlist
    });
  } catch (error) {
    next(error);
  }
};

// Clear wishlist
exports.clearWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return next(createError(404, 'Wishlist not found'));
    }

    await wishlist.clearWishlist();

    res.status(200).json({
      success: true,
      message: 'Wishlist cleared successfully',
      data: wishlist
    });
  } catch (error) {
    next(error);
  }
};