const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const Task = require("../models/Task");

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * @desc    Get all tasks for logged in user
 * @route   GET /api/tasks
 * @access  Private
 */
const getTasks = async (req, res, next) => {
  try {
    const { stage, priority, search } = req.query;

    // Build filter object — always scope to current user
    const where = { userId: req.user.id };

    if (stage) where.stage = stage;
    if (priority) where.priority = priority;
    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }

    const tasks = await Task.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: { tasks },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private
 */
const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422);
      throw new Error(errors.array().map((e) => e.msg).join(", "));
    }

    const { title, description, priority, stage } = req.body;

    const task = await Task.create({
      title,
      description: description || "",
      priority: priority || "Medium",
      stage: stage || "Todo",
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully.",
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422);
      throw new Error(errors.array().map((e) => e.msg).join(", "));
    }

    // Find task and verify ownership
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!task) {
      res.status(404);
      throw new Error("Task not found.");
    }

    const { title, description, priority, stage } = req.body;

    await task.update({
      title: title ?? task.title,
      description: description ?? task.description,
      priority: priority ?? task.priority,
      stage: stage ?? task.stage,
    });

    res.status(200).json({
      success: true,
      message: "Task updated successfully.",
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!task) {
      res.status(404);
      throw new Error("Task not found.");
    }

    await task.destroy();

    res.status(200).json({
      success: true,
      message: "Task deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update task stage (for drag and drop)
 * @route   PATCH /api/tasks/:id/stage
 * @access  Private
 */
const updateTaskStage = async (req, res, next) => {
  try {
    const { stage } = req.body;

    const validStages = ["Todo", "In Progress", "Done"];
    if (!stage || !validStages.includes(stage)) {
      res.status(400);
      throw new Error("Invalid stage. Must be Todo, In Progress, or Done.");
    }

    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!task) {
      res.status(404);
      throw new Error("Task not found.");
    }

    await task.update({ stage });

    res.status(200).json({
      success: true,
      message: "Task stage updated successfully.",
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStage,
};