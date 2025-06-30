import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Heart, ShoppingCart, Truck, Shield, Gift, ArrowRight } from 'lucide-react'
import axios from 'axios'
import { useCart } from '../contexts/CartContext'
import toast from 'react-hot-toast'

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get('/api/v1/products?limit=8'),
        axios.get('/api/v1/categories')
      ])
      
      setFeaturedProducts(productsRes.data.data || [])
      setCategories(categoriesRes.data.data || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (productId) => {
    await addToCart(productId, 1)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4" />
          <p className="text-gray-600">Loading magical toys...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-white/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-5xl lg:text-7xl font-display font-bold text-gradient mb-6">
                Cuddle Your Way to Happiness! 🧸
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Discover our magical collection of premium soft toys that bring joy, 
                comfort, and endless cuddles to children and adults alike.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/products" className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2">
                    <span>Shop Now</span>
                    <ShoppingCart className="h-5 w-5" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/about" className="btn-outline text-lg px-8 py-4 inline-flex items-center space-x-2">
                    <span>Learn More</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <motion.div 
                    className="card p-4"
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <img 
                      src="https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg" 
                      alt="Teddy Bear" 
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </motion.div>
                  <motion.div 
                    className="card p-4"
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                  >
                    <img 
                      src="https://images.pexels.com/photos/1648777/pexels-photo-1648777.jpeg" 
                      alt="Plush Toy" 
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </motion.div>
                </div>
                <div className="space-y-4 mt-8">
                  <motion.div 
                    className="card p-4"
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                  >
                    <img 
                      src="https://images.pexels.com/photos/1648778/pexels-photo-1648778.jpeg" 
                      alt="Cute Animal" 
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </motion.div>
                  <motion.div 
                    className="card p-4"
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
                  >
                    <img 
                      src="https://images.pexels.com/photos/1648779/pexels-photo-1648779.jpeg" 
                      alt="Baby Toy" 
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-display font-bold text-gradient mb-4">
              Why Choose CuddlyPuff? 🌟
            </h2>
            <p className="text-xl text-gray-600">
              We're committed to bringing you the highest quality soft toys
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="h-12 w-12 text-primary-500" />,
                title: "Premium Quality",
                description: "Made with the finest materials, safe for all ages"
              },
              {
                icon: <Truck className="h-12 w-12 text-secondary-500" />,
                title: "Fast Delivery",
                description: "Quick and secure shipping to your doorstep"
              },
              {
                icon: <Gift className="h-12 w-12 text-accent-500" />,
                title: "Perfect Gifts",
                description: "Beautifully packaged for special occasions"
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="card p-8 text-center group"
              >
                <div className="mb-4 flex justify-center group-hover:animate-bounce">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gradient-to-br from-secondary-50 to-accent-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-display font-bold text-gradient mb-4">
              Shop by Category 🎯
            </h2>
            <p className="text-xl text-gray-600">
              Find the perfect companion for every age and occasion
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.slice(0, 4).map((category, index) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Link 
                  to={`/products?category=${category._id}`}
                  className="card p-6 text-center group block"
                >
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-20 h-20 mx-auto mb-4 rounded-full object-cover group-hover:animate-wiggle"
                  />
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{category.count || 0} items</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-display font-bold text-gradient mb-4">
              Featured Products ⭐
            </h2>
            <p className="text-xl text-gray-600">
              Our most loved and cuddly companions
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div 
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="card overflow-hidden group"
              >
                <div className="relative">
                  <img 
                    src={product.images?.[0] || 'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg'} 
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors duration-200"
                  >
                    <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
                  </motion.button>
                </div>
                <div className="p-4">
                  <Link to={`/products/${product._id}`}>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary-600 transition-colors duration-200">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(product.ratings || 4) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">({product.numReviews || 0})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary-600">₹{product.price}</span>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddToCart(product._id)}
                      className="btn-primary py-2 px-4 text-sm flex items-center space-x-1"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Add</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/products" className="btn-secondary text-lg px-8 py-4 inline-flex items-center space-x-2">
              <span>View All Products</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-secondary-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-display font-bold text-white mb-4">
              Join the CuddlyPuff Family! 💌
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Get exclusive offers, new arrivals, and cuddle tips delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-full border-0 focus:ring-4 focus:ring-white/30 text-gray-900"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary-600 font-semibold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                Subscribe 🎉
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

export default Home