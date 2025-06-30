import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CreditCard, MapPin, User, Phone, Mail, Truck, Shield, CheckCircle } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const Checkout = () => {
  const { cart, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.mobile || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  })

  const [paymentMethod, setPaymentMethod] = useState('card')

  const handleInputChange = (e) => {
    setShippingInfo(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Simulate order placement
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Clear cart after successful order
      await clearCart()
      
      toast.success('Order placed successfully! 🎉')
      navigate('/profile?tab=orders')
    } catch (error) {
      toast.error('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const totalAmount = cart?.totalAmount || 0
  const tax = totalAmount * 0.18
  const shipping = totalAmount > 500 ? 0 : 50
  const finalTotal = totalAmount + tax + shipping

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4">🛒</div>
          <h2 className="text-3xl font-display font-bold text-gradient mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Add some cuddly friends to proceed with checkout!
          </p>
          <button 
            onClick={() => navigate('/products')}
            className="btn-primary text-lg px-8 py-4"
          >
            Start Shopping 🧸
          </button>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold text-gradient mb-8">
          Checkout 🛒
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Information */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card p-6"
            >
              <div className="flex items-center mb-4">
                <MapPin className="h-6 w-6 text-primary-500 mr-2" />
                <h2 className="text-xl font-semibold">Shipping Information</h2>
              </div>
              
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={shippingInfo.fullName}
                        onChange={handleInputChange}
                        className="input-field pl-10"
                        placeholder="Enter full name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        required
                        value={shippingInfo.email}
                        onChange={handleInputChange}
                        className="input-field pl-10"
                        placeholder="Enter email"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={shippingInfo.phone}
                        onChange={handleInputChange}
                        className="input-field pl-10"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      value={shippingInfo.pincode}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter pincode"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    required
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="input-field"
                    placeholder="Enter complete address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter city"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter state"
                    />
                  </div>
                </div>
              </form>
            </motion.div>

            {/* Payment Method */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center mb-4">
                <CreditCard className="h-6 w-6 text-primary-500 mr-2" />
                <h2 className="text-xl font-semibold">Payment Method</h2>
              </div>

              <div className="space-y-4">
                {[
                  { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
                  { id: 'upi', label: 'UPI Payment', icon: '📱' },
                  { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
                  { id: 'cod', label: 'Cash on Delivery', icon: '💵' }
                ].map((method) => (
                  <label key={method.id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-2xl">{method.icon}</span>
                    <span className="font-medium">{method.label}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card p-6 sticky top-24"
            >
              <h3 className="font-semibold text-xl mb-4">Order Summary</h3>
              
              {/* Order Items */}
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {cart.items?.map((item) => (
                  <div key={item.product._id} className="flex items-center space-x-3">
                    <img
                      src={item.product.images?.[0] || 'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg'}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.product.name}</h4>
                      <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.totalItems} items)</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>
                    {shipping === 0 ? 'Free' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Security Features */}
              <div className="space-y-3 mb-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Secure SSL encrypted payment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4 text-blue-500" />
                  <span>Free shipping on orders over ₹500</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-primary-500" />
                  <span>30-day return policy</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePlaceOrder}
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="spinner" />
                ) : (
                  <>
                    <span>Place Order</span>
                    <span>🎉</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Checkout