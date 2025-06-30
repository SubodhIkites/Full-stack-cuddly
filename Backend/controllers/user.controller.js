const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createError } = require('../utils/error');
const crypto = require('crypto');

// Register new user
exports.register = async (req, res, next) => {
    try {
        const { email, password, name, mobile, role } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
        if (existingUser) {
            return next(createError(400, 'Email or mobile number already registered'));
        }

        // Create new user (password will be hashed by the model's pre-save hook)
        const user = new User({
            name,
            email,
            password,
            mobile,
            role
        });

        await user.save();

        // Generate token
        const token = jwt.sign(
            { id: user._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Remove password from response
        user.password = undefined;

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        next(error);
    }
};

// Login user
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if user exists and explicitly select password field
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return next(createError(404, 'User not found'));
        }

        // Check password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return next(createError(400, 'Invalid credentials'));
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Remove password from response
        user.password = undefined;

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        next(error);
    }
};

// Logout user
exports.logout = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};

// Get all users
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        next(error);
    }
};

// Get user by ID
exports.getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return next(createError(404, 'User not found'));
        }
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};

// Update user
exports.updateUser = async (req, res, next) => {
    try {
        const { name, email } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return next(createError(404, 'User not found'));
        }

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            user
        });
    } catch (error) {
        next(error);
    }
};

// Delete user
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return next(createError(404, 'User not found'));
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Update password
exports.updatePassword = async (req, res, next) => {
    console.log("update password");
    try {
        const { currentPassword, newPassword } = req.body;
        console.log("currentPassword", currentPassword);
        console.log("newPassword", newPassword);
        const user = await User.findById(req.params.id).select('+password');
        // console.log("user", user);
        if (!user) {
            return next(createError(404, 'User not found'));
        }
        console.log("user found");
        // Verify current password
        const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
        console.log("isPasswordCorrect", isPasswordCorrect);
        if (!isPasswordCorrect) {
            return next(createError(400, 'Current password is incorrect'));
        }
        console.log("password correct");
        // Hash new password
        // const salt = await bcrypt.genSalt(10);
        // console.log("salt", salt);
        // const hashedPassword = await bcrypt.hash(newPassword, salt);
        // console.log("hashedPassword", hashedPassword);
        // Update password
        user.password = newPassword;
        console.log("user", user);
        await user.save();
        console.log("user saved");
        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Get current user
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return next(createError(404, 'User not found'));
        }
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};

// Forgot password
exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return next(createError(404, 'User not found'));
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.passwordResetToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save({ validateBeforeSave: false });

        // TODO: Send email with reset token
        // For now, just return the token
        res.status(200).json({
            success: true,
            message: 'Password reset token generated',
            resetToken
        });
    } catch (error) {
        next(error);
    }
};

// Reset password
exports.resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;

        // Hash token
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return next(createError(400, 'Invalid or expired token'));
        }

        // Update password (let the model's pre-save hook handle hashing)
        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        user.passwordChangedAt = Date.now();

        // Save with validation to ensure password is properly hashed
        await user.save();

        // Generate new token
        const newToken = jwt.sign(
            { id: user._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            message: 'Password reset successful',
            token: newToken
        });
    } catch (error) {
        next(error);
    }
}; 