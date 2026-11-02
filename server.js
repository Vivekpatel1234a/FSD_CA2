const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

const feedbackRoutes = require("./routes/feedback");

app.use("/api/feedback", feedbackRoutes);

app.listen(process.env.PORT, () => {
    console.log("Server running on port 3000");
});