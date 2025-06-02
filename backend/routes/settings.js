const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET user settings
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user.settings || {});
  } catch (err) {
    console.error("❌ Settings fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT (update) user settings
router.put("/:userId", async (req, res) => {
  const { userId } = req.params;
  const { fontSize, fontFamily, lineHeight } = req.body;

  if (!fontSize || !fontFamily || !lineHeight) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          settings: {
            fontSize,
            fontFamily,
            lineHeight,
          }
        }
      },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.status(200).json(updatedUser.settings);
  } catch (err) {
    console.error("❌ Settings update failed:", err);
    res.status(500).json({ error: "Update failed" });
  }
});

module.exports = router;
