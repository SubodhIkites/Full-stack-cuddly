const jwt = require("jsonwebtoken");
const { createError } = require("../utils/error");
const User = require("../models/user.model");

// Verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(createError(401, "No token provided"));
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(createError(401, "No token provided"));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded || !decoded.id) {
        return next(createError(401, "Invalid token payload"));
      }

      // Find user
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return next(createError(401, "User not found"));
      }

      // Check if password was changed after token was issued
      if (user.passwordChangedAt) {
        const changedTimestamp = parseInt(
          user.passwordChangedAt.getTime() / 1000,
          10
        );
        if (decoded.iat < changedTimestamp) {
          return next(
            createError(401, "Password was changed. Please login again")
          );
        }
      }

      req.user = user;
      console.log("token verified", req.user);
      next();
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return next(createError(401, "Invalid token"));
      }
      if (error.name === "TokenExpiredError") {
        return next(createError(401, "Token expired"));
      }
      return next(createError(401, "Token verification failed"));
    }
  } catch (error) {
    next(error);
  }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  console.log("USERS : ", req.user);
  if (req.user.role !== "admin") {
    return next(createError(403, "You are not authorized as an admin"));
  }
  console.log("admin verified");
  next();
};

module.exports = { verifyToken, isAdmin };
