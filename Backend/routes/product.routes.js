const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const { validateObjectId } = require('../middleware/validation.middleware');
const {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    getProductReviews
} = require('../controllers/product.controller');

// Public routes
router.get('/', getProducts);
router.get('/:id', validateObjectId, getProduct);
router.get('/:id/reviews', validateObjectId, getProductReviews);

// Protected routes (admin only)
router.post('/', verifyToken, isAdmin, createProduct);
router.put('/:id', verifyToken, isAdmin, validateObjectId, updateProduct);
router.delete('/:id', verifyToken, isAdmin, validateObjectId, deleteProduct);
router.patch('/:id/stock', verifyToken, isAdmin, validateObjectId, updateProductStock);

module.exports = router; 