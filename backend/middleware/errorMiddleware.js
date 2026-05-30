const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, _next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Internal Server Error";

  // Sequelize: duplicate entry (unique constraint)
  if (err.name === "SequelizeUniqueConstraintError") {
    statusCode = 409;
    message = `${err.errors[0].path} already exists.`;
  }

  // Sequelize: validation errors
  if (err.name === "SequelizeValidationError") {
    statusCode = 422;
    message = err.errors.map((e) => e.message).join(", ");
  }

  // Sequelize: database connection error
  if (err.name === "SequelizeConnectionError") {
    statusCode = 503;
    message = "Database connection failed.";
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again.";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired. Please log in again.";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };