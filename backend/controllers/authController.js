const { validationResult } = require("express-validator");
const User = require("../models/User");
const { generateToken } = require("../utils/generateToken");

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Builds the safe user payload returned in API responses.
 * Explicitly excludes the hashed password.
 */
const buildUserPayload = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    // 1. Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422);
      throw new Error(errors.array().map((e) => e.msg).join(", "));
    }

    const { name, email, password } = req.body;

    // 2. Check for duplicate email
    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      res.status(409);
      throw new Error("An account with this email already exists.");
    }

    // 3. Create user
    // Password is hashed inside the Sequelize beforeCreate hook (bcryptjs)
    const user = await User.create({ name, email, password });

    // 4. Generate JWT
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
      data: { token, user: buildUserPayload(user) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user and return token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    // 1. Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422);
      throw new Error(errors.array().map((e) => e.msg).join(", "));
    }

    const { email, password } = req.body;

    // 2. Find user WITH password
    // Sequelize uses .scope("withPassword") because password is excluded by defaultScope
    const user = await User.scope("withPassword").findOne({
      where: { email: email.toLowerCase() },
    });

    // 3. Generic error prevents user enumeration attacks
    const INVALID_CREDENTIALS = "Invalid email or password.";
    if (!user) {
      res.status(401);
      throw new Error(INVALID_CREDENTIALS);
    }

    // 4. Compare passwords using instance method defined in User model
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error(INVALID_CREDENTIALS);
    }

    // 5. Generate JWT
    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      data: { token, user: buildUserPayload(user) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get the currently authenticated user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    // req.user is populated by the protect middleware
    // Sequelize uses findByPk (find by Primary Key)
    const user = await User.findByPk(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found.");
    }

    res.status(200).json({
      success: true,
      data: { user: buildUserPayload(user) },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };