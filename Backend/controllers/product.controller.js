const Product = require('../models/product.model');
const { createError } = require('../utils/error');

// Get all products with filtering, sorting, and pagination
exports.getProducts = async (req, res, next) => {
    try {
        const { 
            category, 
            minPrice, 
            maxPrice, 
            sort = '-createdAt',
            page = 1,
            limit = 10
        } = req.query;

        const query = {};
        
        // Apply filters
        if (category) query.category = category;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const products = await Product.find(query)
            .populate('category', 'name')
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            data: products,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get single product
exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name');

        if (!product) {
            return next(createError(404, 'Product not found'));
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// Create new product
exports.createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// Update product
exports.updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return next(createError(404, 'Product not found'));
        }

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// Delete product
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return next(createError(404, 'Product not found'));
        }

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Update product stock
exports.updateProductStock = async (req, res, next) => {
    try {
        const { stock } = req.body;

        if (typeof stock !== 'number' || stock < 0) {
            return next(createError(400, 'Invalid stock value'));
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { stock },
            { new: true, runValidators: true }
        );

        if (!product) {
            return next(createError(404, 'Product not found'));
        }

        res.status(200).json({
            success: true,
            message: 'Product stock updated successfully',
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// Get product reviews
exports.getProductReviews = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate({
                path: 'reviews.user',
                select: 'name email'
            });

        if (!product) {
            return next(createError(404, 'Product not found'));
        }

        res.status(200).json({
            success: true,
            data: product.reviews || []
        });
    } catch (error) {
        next(error);
    }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get bestseller products
exports.getBestsellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ isBestseller: true });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get new products
exports.getNewProducts = async (req, res) => {
  try {
    const products = await Product.find({ isNew: true });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 