require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const feedbackRoutes = require("./routes/feedback");

const app = express();
const port = process.env.PORT || 3000;
const mongoUri =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/student_feedback";

app.use(express.json());
app.use("/api/feedback", feedbackRoutes);

app.use((error, req, res, next) => {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON request body." });
  }

  console.error(error);
  return res.status(500).json({ message: "Internal server error." });
});

async function startServer() {
  try {
    await mongoose.connect(mongoUri);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Could not connect to MongoDB:", error.message);
    process.exitCode = 1;
  }
}

startServer();
