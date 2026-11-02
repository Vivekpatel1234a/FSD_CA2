const express = require("express");
const Feedback = require("../models/Feedback");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { studentName, courseName, message, rating } = req.body;

        if (!studentName || !courseName || !message || rating === undefined) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            });
        }

        const feedback = await Feedback.create({
            studentName,
            courseName,
            message,
            rating
        });

        res.status(201).json({
            message: "Feedback submitted successfully",
            feedback
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get("/", async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const skip = (page - 1) * limit;

        const feedback = await Feedback.find()
            .skip(skip)
            .limit(limit);

        const totalRecords = await Feedback.countDocuments();

        res.json({
            currentPage: page,
            totalRecords,
            feedback
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.patch("/:id", async (req, res) => {
    try {
        const { status } = req.body;

        const feedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true }
        );

        if (!feedback) {
            return res.status(404).json({
                message: "Feedback not found"
            });
        }

        res.json({
            message: "Status updated successfully",
            feedback
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;