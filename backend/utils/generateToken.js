const jwt = require("jsonwebtoken");

/**
 * Generates a signed JWT access token.
 * @param {number} userId - The user ID from the database.
 * @returns {string} Signed JWT string.
 */
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined.");
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    issuer: "task-manager-api",
  });
};

/**
 * Verifies and decodes a JWT token.
 * @param {string} token - The JWT string to verify.
 * @returns {object} Decoded payload.
 * @throws Will throw if the token is invalid or expired.
 */
const verifyToken = (token) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined.");
  }

  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
