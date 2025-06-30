const express = require("express");
const {
  register,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updatePassword,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
} = require("../controllers/user.controller");
const {
  validateRegistration,
  validateLogin,
  validateObjectId,
  validateUpdateUser,
  validatePasswordUpdate,
  validateForgotPassword,
  validateResetPassword,
} = require("../middleware/validation.middleware");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");
const { passwordUpdateLimiter } = require("../middleware/rateLimit.middleware");

const router = express.Router();

// Public routes
router.post("/register", validateRegistration, register);
router.post("/login", validateLogin, login);
router.post("/forgot-password", validateForgotPassword, forgotPassword);
router.post("/reset-password", validateResetPassword, resetPassword);

// Authenticated user routes
router.get("/me", verifyToken, getMe);
router.post("/logout", verifyToken, logout);

// Admin/user management routes
router.get("/", verifyToken, isAdmin, getAllUsers);
router.get("/:id", verifyToken, validateObjectId, getUserById);
router.patch(
  "/:id",
  verifyToken,
  isAdmin,
  validateObjectId,
  validateUpdateUser,
  updateUser
);
router.delete("/:id", verifyToken, isAdmin, validateObjectId, deleteUser);
router.patch(
  "/:id/password",
  verifyToken,
  isAdmin,
  validateObjectId,
  validatePasswordUpdate,
  updatePassword
);

module.exports = router;
