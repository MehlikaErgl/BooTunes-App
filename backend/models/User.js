const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  settings: {
    fontSize: { type: String, default: "16px" },
    fontFamily: { type: String, default: "Georgia, serif" },
    lineHeight: { type: String, default: "1.6" }
  }
});

module.exports = mongoose.model("User", userSchema);
