const express = require('express');
const router = express.Router();
const addressController = require('../controllers/address.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// All address routes require authentication
router.use(verifyToken);

// Get all addresses
router.get('/', addressController.getAddresses);

// Get a single address
router.get('/:id', addressController.getAddress);

// Create a new address
router.post('/', addressController.createAddress);

// Update an address
router.patch('/:id', addressController.updateAddress);

// Delete an address
router.delete('/:id', addressController.deleteAddress);

// Set default address
router.patch('/:id/default', addressController.setDefaultAddress);

module.exports = router; 