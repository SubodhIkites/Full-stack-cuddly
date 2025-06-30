const { createError } = require('../utils/error');
const mongoose = require('mongoose');

// Validate registration request
const validateRegistration = (req, res, next) => {
    const { name, email, password, confirmPassword, mobile } = req.body;

    if (!name || !email || !password || !confirmPassword || !mobile) {
        return next(createError(400, 'Please provide all required fields'));
    }

    if (name.length < 2 || name.length > 50) {
        return next(createError(400, 'Name must be between 2 and 50 characters'));
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return next(createError(400, 'Please provide a valid email address'));
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
        return next(createError(400, 'Please provide a valid 10-digit mobile number'));
    }

    if (password.length < 6) {
        return next(createError(400, 'Password must be at least 6 characters long'));
    }

    if (password !== confirmPassword) {
        return next(createError(400, 'Passwords do not match'));
    }

    next();
};

// Validate login data
const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(createError(400, 'Please provide email and password'));
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return next(createError(400, 'Please provide a valid email address'));
    }

    next();
};

// Validate MongoDB ObjectId
const validateObjectId = (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(createError(400, 'Invalid ID format'));
    }
    console.log("id validated", id);
    next();
};

// Validate user update data
const validateUpdateUser = (req, res, next) => {
    const { name, email } = req.body;

    if (!name && !email) {
        return next(createError(400, 'Please provide at least one field to update'));
    }

    if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return next(createError(400, 'Please provide a valid email address'));
    }

    next();
};

// Validate password update data
const validatePasswordUpdate = (req, res, next) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return next(createError(400, 'Please provide both current and new password'));
    }

    if (newPassword.length < 6) {
        return next(createError(400, 'New password must be at least 6 characters long'));
    }

    if (currentPassword === newPassword) {
        return next(createError(400, 'New password must be different from current password'));
    }
    console.log("password validated", currentPassword, newPassword);
    next();
};

// Validate forgot password request
const validateForgotPassword = (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(createError(400, 'Please provide your email address'));
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return next(createError(400, 'Please provide a valid email address'));
    }

    next();
};

// Validate reset password request
const validateResetPassword = (req, res, next) => {
    const { token, password } = req.body;

    if (!token || !password) {
        return next(createError(400, 'Please provide both token and new password'));
    }

    if (password.length < 6) {
        return next(createError(400, 'Password must be at least 6 characters long'));
    }

    next();
};

module.exports = {
    validateRegistration,
    validateLogin,
    validateObjectId,
    validateUpdateUser,
    validatePasswordUpdate,
    validateForgotPassword,
    validateResetPassword
}; 