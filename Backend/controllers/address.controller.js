const Address = require('../models/address.model');
const { createError } = require('../utils/error');

// Get all addresses for a user
exports.getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find({ user: req.user._id })
      .sort({ isDefault: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: addresses
    });
  } catch (error) {
    next(error);
  }
};

// Get a single address
exports.getAddress = async (req, res, next) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!address) {
      return next(createError(404, 'Address not found'));
    }

    res.status(200).json({
      success: true,
      data: address
    });
  } catch (error) {
    next(error);
  }
};

// Create a new address
exports.createAddress = async (req, res, next) => {
  try {
    const {
      fullName,
      phoneNumber,
      streetAddress,
      city,
      state,
      postalCode,
      country,
      isDefault,
      addressType
    } = req.body;

    // If this is the first address, make it default
    const addressCount = await Address.countDocuments({ user: req.user._id });
    const shouldBeDefault = addressCount === 0 || isDefault;

    const address = await Address.create({
      user: req.user._id,
      fullName,
      phoneNumber,
      streetAddress,
      city,
      state,
      postalCode,
      country,
      isDefault: shouldBeDefault,
      addressType
    });

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: address
    });
  } catch (error) {
    next(error);
  }
};

// Update an address
exports.updateAddress = async (req, res, next) => {
  try {
    const {
      fullName,
      phoneNumber,
      streetAddress,
      city,
      state,
      postalCode,
      country,
      isDefault,
      addressType
    } = req.body;

    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!address) {
      return next(createError(404, 'Address not found'));
    }

    // Update fields
    Object.assign(address, {
      fullName,
      phoneNumber,
      streetAddress,
      city,
      state,
      postalCode,
      country,
      isDefault,
      addressType
    });

    await address.save();

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: address
    });
  } catch (error) {
    next(error);
  }
};

// Delete an address
exports.deleteAddress = async (req, res, next) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!address) {
      return next(createError(404, 'Address not found'));
    }

    await address.deleteOne();

    // If the deleted address was default, make the most recent address default
    if (address.isDefault) {
      const mostRecentAddress = await Address.findOne({ user: req.user._id })
        .sort({ createdAt: -1 });
      
      if (mostRecentAddress) {
        mostRecentAddress.isDefault = true;
        await mostRecentAddress.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Set default address
exports.setDefaultAddress = async (req, res, next) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!address) {
      return next(createError(404, 'Address not found'));
    }

    address.isDefault = true;
    await address.save();

    res.status(200).json({
      success: true,
      message: 'Default address updated successfully',
      data: address
    });
  } catch (error) {
    next(error);
  }
};