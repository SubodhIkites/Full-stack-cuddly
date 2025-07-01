const { AppError, createError } = require('./error');

const handleError = (err, res) => {
  const { statusCode = 500, message } = err;
  
  res.status(statusCode).json({
    success: false,
    message: message || 'Internal server error'
  });
};

module.exports = { AppError, createError, handleError };