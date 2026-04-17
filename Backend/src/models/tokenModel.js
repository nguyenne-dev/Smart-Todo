const mongoose = require("mongoose");

// Define the token schema
const tokenSchema = new mongoose.Schema(
  {
    // Reference to the user associated with the token
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    // The token string itself, indexed for fast lookup
    token: { type: String, required: true, index: true },
    type: { type: String, enum: ["verify", "reset", "refresh"] },
    // Flag to indicate if the token has been used
    used: { type: Boolean, default: false },
    // Expiration date of the token, indexed to allow automatic deletion of expired tokens
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

// Automatically delete expired tokens
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Token", tokenSchema);
