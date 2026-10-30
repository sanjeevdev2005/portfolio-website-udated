
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const projectRoute = require("./routes/project");
const authRoute = require("./routes/auth");
const resumeRoute = require("./routes/resume");

const app = express();

// Middleware
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

// Home route
app.get("/", (req, res) => {
    res.send("Portfolio backend is running!");
});

// API routes
app.use("/api/projects", projectRoute);
app.use("/api/auth", authRoute);
app.use("/api/resume", resumeRoute);

// Connect to MongoDB and start server
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("MongoDB Connected");

        app.listen(5000, () => {
            console.log("Server is running on port 5000");
        });
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error.message);
    });
