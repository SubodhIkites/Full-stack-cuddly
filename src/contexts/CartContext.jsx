import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart()
    } else {
      setCart(null)
    }
  }, [isAuthenticated])

  const fetchCart = async () => {
    if (!isAuthenticated) return
    
    try {
      setLoading(true)
      const response = await axios.get('/api/v1/cart')
      setCart(response.data.data)
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart')
      return { success: false }
    }

    try {
      setLoading(true)
      const response = await axios.post('/api/v1/cart/add', {
        productId,
        quantity
      })
      
      setCart(response.data.data)
      toast.success('Added to cart! 🛒')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to cart'
      toast.error(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const updateCartItem = async (productId, quantity) => {
    if (!isAuthenticated) return { success: false }

    try {
      setLoading(true)
      const response = await axios.patch(`/api/v1/cart/items/${productId}`, {
        quantity
      })
      
      setCart(response.data.data)
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update cart'
      toast.error(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return { success: false }

    try {
      setLoading(true)
      const response = await axios.delete(`/api/v1/cart/items/${productId}`)
      
      setCart(response.data.data)
      toast.success('Removed from cart')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove from cart'
      toast.error(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    if (!isAuthenticated) return { success: false }

    try {
      setLoading(true)
      const response = await axios.delete('/api/v1/cart/clear')
      
      setCart(response.data.data)
      toast.success('Cart cleared')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear cart'
      toast.error(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const getCartItemsCount = () => {
    return cart?.totalItems || 0
  }

  const getCartTotal = () => {
    return cart?.totalAmount || 0
  }

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart,
    getCartItemsCount,
    getCartTotal
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}