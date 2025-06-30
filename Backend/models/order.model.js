const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    }
  },
  paymentInfo: {
    id: String,
    status: String,
    type: String
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  trackingNumber: String,
  estimatedDelivery: Date
}, {
  timestamps: true
});

// Calculate total amount before saving
orderSchema.pre('save', function(next) {
  if (this.isModified('items')) {
    this.totalAmount = this.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }
  next();
});

// Method to update order status
orderSchema.methods.updateStatus = async function(status) {
  this.status = status;
  await this.save();
  return this;
};

// Method to add tracking information
orderSchema.methods.addTracking = async function(trackingNumber, estimatedDelivery) {
  this.trackingNumber = trackingNumber;
  this.estimatedDelivery = estimatedDelivery;
  await this.save();
  return this;
};

// Method to cancel order
orderSchema.methods.cancelOrder = async function() {
  if (this.status === 'delivered') {
    throw new Error('Cannot cancel a delivered order');
  }
  this.status = 'cancelled';
  await this.save();
  return this;
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; 