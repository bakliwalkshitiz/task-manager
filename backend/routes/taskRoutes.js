const express = require("express");
const { body } = require("express-validator");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStage,
} = require("../controllers/taskController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ─── Validation Rules ─────────────────────────────────────────────────────────

const taskValidation = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ max: 100 }).withMessage("Title must be less than 100 characters"),
  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High"]).withMessage("Priority must be Low, Medium, or High"),
  body("stage")
    .optional()
    .isIn(["Todo", "In Progress", "Done"]).withMessage("Stage must be Todo, In Progress, or Done"),
];

// ─── All routes are protected ─────────────────────────────────────────────────
router.use(protect);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks for logged in user
 * @access  Private
 */
router.get("/", getTasks);

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private
 */
router.post("/", taskValidation, createTask);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task
 * @access  Private
 */
router.put("/:id", taskValidation, updateTask);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Private
 */
router.delete("/:id", deleteTask);

/**
 * @route   PATCH /api/tasks/:id/stage
 * @desc    Update task stage (drag and drop)
 * @access  Private
 */
router.patch("/:id/stage", updateTaskStage);

module.exports = router;