const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, enum: ["male", "female", "other"] },
    dateOfBirth: { type: Date },
    phone: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    address: { type: String },
    avatarUrl: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
