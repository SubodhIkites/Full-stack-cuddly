import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
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
  const [cart, setCart] = useState({ items: [], totalAmount: 0, totalItems: 0 })
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart()
    } else {
      setCart({ items: [], totalAmount: 0, totalItems: 0 })
    }
  }, [isAuthenticated])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:3001/api/v1/cart')
      setCart(response.data.data)
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true)
      const response = await axios.post('http://localhost:3001/api/v1/cart/add', {
        productId,
        quantity
      })
      setCart(response.data.data)
      return { success: true }
    } catch (error) {
      console.error('Failed to add to cart:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to add to cart' 
      }
    } finally {
      setLoading(false)
    }
  }

  const updateCartItem = async (productId, quantity) => {
    try {
      setLoading(true)
      const response = await axios.patch(`http://localhost:3001/api/v1/cart/items/${productId}`, {
        quantity
      })
      setCart(response.data.data)
      return { success: true }
    } catch (error) {
      console.error('Failed to update cart item:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update cart' 
      }
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (productId) => {
    try {
      setLoading(true)
      const response = await axios.delete(`http://localhost:3001/api/v1/cart/items/${productId}`)
      setCart(response.data.data)
      return { success: true }
    } catch (error) {
      console.error('Failed to remove from cart:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to remove from cart' 
      }
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    try {
      setLoading(true)
      const response = await axios.delete('http://localhost:3001/api/v1/cart/clear')
      setCart(response.data.data)
      return { success: true }
    } catch (error) {
      console.error('Failed to clear cart:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to clear cart' 
      }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}