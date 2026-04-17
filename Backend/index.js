// Import necessary modules
const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const errorHandler = require("./src/middlewares/errorHandler");

// Initialize Express app
const app = express();
// Set the port
const port = process.env.PORT || 3002;
// Middleware
app.use(express.json());
// Use cookie parser middleware
app.use(cookieParser());
// Enable CORS with credentials
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Routes
const authRoutes = require("./src/routes/AuthRoutes");
const userRoutes = require("./src/routes/UserRoutes");



// Use routes and error handler
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use(errorHandler);

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};
connectDB();

// Run the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
