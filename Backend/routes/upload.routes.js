const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const {
    uploadImage,
    uploadMultipleImages,
    deleteImage
} = require('../controllers/upload.controller');

// All upload routes require authentication
router.use(authenticateToken);

// Upload single image
router.post('/image', upload.single('image'), uploadImage);

// Upload multiple images
router.post('/images', upload.array('images', 5), uploadMultipleImages);

// Delete image
router.delete('/image/:imageId', deleteImage);

module.exports = router; 