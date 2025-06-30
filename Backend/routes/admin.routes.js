const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/auth');
const {
    getDashboardStats,
    getAllUsers,
    updateUserStatus,
    getAllOrders,
    updateOrderStatus,
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/admin.controller');

// All admin routes require authentication and admin privileges
router.use(authenticateToken);
router.use(isAdmin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.patch('/users/:userId/status', updateUserStatus);

// Order management
router.get('/orders', getAllOrders);
router.patch('/orders/:orderId/status', updateOrderStatus);

// Product management
router.get('/products', getAllProducts);
router.post('/products', createProduct);
router.put('/products/:productId', updateProduct);
router.delete('/products/:productId', deleteProduct);

// Category management
router.get('/categories', getAllCategories);
router.post('/categories', createCategory);
router.put('/categories/:categoryId', updateCategory);
router.delete('/categories/:categoryId', deleteCategory);

module.exports = router; 