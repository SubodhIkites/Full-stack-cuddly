const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    enum: ['INR'],
    default: 'INR'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'stripe'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentDetails: {
    transactionId: String,
    paymentIntentId: String,
    paymentMethodId: String,
    last4: String,
    brand: String,
    receiptUrl: String
  },
  refundDetails: {
    refundId: String,
    amount: Number,
    reason: String,
    status: String,
    createdAt: Date
  }
}, {
  timestamps: true
});

// Method to update payment status
paymentSchema.methods.updateStatus = async function(status) {
  this.status = status;
  await this.save();
  return this;
};

// Method to add payment details
paymentSchema.methods.addPaymentDetails = async function(details) {
  this.paymentDetails = {
    ...this.paymentDetails,
    ...details
  };
  await this.save();
  return this;
};

// Method to process refund
paymentSchema.methods.processRefund = async function(refundDetails) {
  if (this.status !== 'completed') {
    throw new Error('Can only refund completed payments');
  }

  this.refundDetails = {
    ...refundDetails,
    createdAt: new Date()
  };
  this.status = 'refunded';
  await this.save();
  return this;
};

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment; 