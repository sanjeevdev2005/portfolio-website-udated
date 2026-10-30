require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const projectRoute = require("./routes/project");
const authRoute = require("./routes/auth");
const resumeRoute = require("./routes/resume");
const PORT = process.env.PORT || 5000;

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://sanjeev-hrnq.onrender.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
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

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
  });
