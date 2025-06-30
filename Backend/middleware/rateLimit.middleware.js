const rateLimit = require('express-rate-limit');

// Rate limiter for password updates
exports.passwordUpdateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30, // 30 attempts
    message: {
        success: false,
        message: 'Too many password update attempts. Please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false
}); 