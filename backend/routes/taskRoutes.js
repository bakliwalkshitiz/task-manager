const express = require("express");
const router = express.Router();

// Placeholder – full implementation in commit 21-24
router.get("/", (_req, res) =>
  res.status(200).json({ success: true, message: "Task routes active" })
);

module.exports = router;
