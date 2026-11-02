const express = require("express");
const mongoose = require("mongoose");
const Feedback = require("../models/Feedback");

const router = express.Router();
const validStatuses = ["Pending", "Reviewed"];

router.post("/", async (req, res, next) => {
  try {
    const { studentName, courseName, message, rating } = req.body || {};

    if (!studentName || !courseName || !message || rating === undefined) {
      return res.status(400).json({
        message: "studentName, courseName, message, and rating are required.",
      });
    }

    const feedback = await Feedback.create({
      studentName,
      courseName,
      message,
      rating,
    });

    return res.status(201).json(feedback);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }
    return next(error);
  }
});

router.get("/", async (req, res, next) => {
  const page = Number.parseInt(req.query.page, 10) || 1;
  const limit = Number.parseInt(req.query.limit, 10) || 10;

  if (page < 1 || limit < 1 || limit > 100) {
    return res.status(400).json({
      message: "page must be positive and limit must be between 1 and 100.",
    });
  }

  try {
    const [feedback, totalRecords] = await Promise.all([
      Feedback.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Feedback.countDocuments(),
    ]);

    return res.json({
      feedback,
      currentPage: page,
      totalRecords,
    });
  } catch (error) {
    return next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  const { status } = req.body || {};

  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid feedback ID." });
  }

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      message: "status must be either Pending or Reviewed.",
    });
  }

  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found." });
    }

    return res.json(feedback);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
