const mongoose = require("mongoose");

const userSettingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  darkMode: { type: Boolean, default: false },
  fontSize: { type: String, enum: ["small", "medium", "large"], default: "medium" },
  fontFamily: { type: String, default: "Georgia, serif" }
});

module.exports = mongoose.model("UserSettings", userSettingsSchema);
