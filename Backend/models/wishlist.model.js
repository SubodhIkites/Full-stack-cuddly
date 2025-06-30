const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, {
  timestamps: true
});

// Method to add product to wishlist
wishlistSchema.methods.addProduct = async function(productId) {
  if (!this.products.includes(productId)) {
    this.products.push(productId);
    await this.save();
  }
  return this;
};

// Method to remove product from wishlist
wishlistSchema.methods.removeProduct = async function(productId) {
  this.products = this.products.filter(id => id.toString() !== productId.toString());
  await this.save();
  return this;
};

// Method to check if product is in wishlist
wishlistSchema.methods.hasProduct = function(productId) {
  return this.products.some(id => id.toString() === productId.toString());
};

// Method to clear wishlist
wishlistSchema.methods.clearWishlist = async function() {
  this.products = [];
  await this.save();
  return this;
};

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;