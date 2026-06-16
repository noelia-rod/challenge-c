/**
 * Global error handling middleware.
 * Returns consistent JSON error responses without leaking internals.
 */
const errorHandler = (err, _req, res, _next) => {
  console.error('[ErrorHandler]', err);

  // Custom application errors carry a statusCode
  const statusCode = err.statusCode || 500;

  const body = {
    success: false,
    message: err.message || 'Internal server error',
  };

  // Append validation errors when present
  if (err.errors) {
    body.errors = err.errors;
  }

  return res.status(statusCode).json(body);
};

module.exports = { errorHandler };
