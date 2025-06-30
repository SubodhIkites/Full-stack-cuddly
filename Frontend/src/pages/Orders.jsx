import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, Truck, CheckCircle, Clock, X } from 'lucide-react'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching orders
    setTimeout(() => {
      setOrders([
        {
          id: 'ORD-001',
          date: '2024-01-15',
          status: 'delivered',
          total: 89.99,
          items: [
            {
              name: 'Cute Brown Teddy Bear',
              image: 'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg',
              quantity: 1,
              price: 29.99
            },
            {
              name: 'Fluffy Bunny Plush',
              image: 'https://images.pexels.com/photos/1648777/pexels-photo-1648777.jpeg',
              quantity: 2,
              price: 24.99
            }
          ]
        },
        {
          id: 'ORD-002',
          date: '2024-01-20',
          status: 'shipped',
          total: 45.99,
          items: [
            {
              name: 'Baby Elephant Soft Toy',
              image: 'https://images.pexels.com/photos/1648778/pexels-photo-1648778.jpeg',
              quantity: 1,
              price: 35.99
            }
          ]
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'cancelled':
        return <X className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-8"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold text-gradient mb-8">
          My Orders 📦
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-8xl mb-4">📦</div>
            <h2 className="text-3xl font-display font-bold text-gradient mb-4">
              No orders yet
            </h2>
            <p className="text-gray-600 mb-8">
              Start shopping to see your orders here!
            </p>
            <button 
              onClick={() => window.location.href = '/products'}
              className="btn-primary text-lg px-8 py-4"
            >
              Start Shopping 🛍️
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6"
              >
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Order {order.id}</h3>
                    <p className="text-gray-600">Placed on {new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center space-x-4 mt-4 md:mt-0">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </span>
                    <span className="text-xl font-bold">₹{order.total}</span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  {order.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <span className="font-medium">₹{item.price}</span>
                    </div>
                  ))}
                </div>

                {/* Order Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t">
                  <button className="btn-outline flex-1">
                    View Details
                  </button>
                  {order.status === 'delivered' && (
                    <button className="btn-primary flex-1">
                      Write Review
                    </button>
                  )}
                  {order.status === 'shipped' && (
                    <button className="btn-secondary flex-1">
                      Track Order
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Orders