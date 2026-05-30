const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Middleware to protect private routes.
 *
 * Expects: `Authorization: Bearer <token>` header.
 *
 * On success: attaches `req.user` (the user record, minus password)
 *             and calls `next()`.
 * On failure: passes an error to the centralized error handler.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      res.status(401);
      throw new Error("Not authorized. No token provided.");
    }

    // 2. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      res.status(401);
      throw jwtError; // Bubbles to errorHandler (handles JsonWebTokenError & TokenExpiredError)
    }

    // 3. Fetch fresh user from DB – confirms user still exists and isn't deleted
    const user = await User.findByPk(decoded.id);
    if (!user) {
      res.status(401);
      throw new Error("Not authorized. User no longer exists.");
    }

    // 4. Attach user to request and proceed
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = protect;
