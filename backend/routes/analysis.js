// File: backend/routes/analysis.js

const express = require("express");
const router  = express.Router();
const fs      = require("fs");
const path    = require("path");

// GET /api/analysis/:bookId
//   → “backend/chapters/<bookId>/ANALYSIS/” altındaki
//      tüm “_emotion.txt” dosyalarının listesini JSON olarak döner
router.get("/:bookId", (req, res) => {
  const { bookId } = req.params;
  const analysisDir = path.join(__dirname, "..", "chapters", bookId, "ANALYSIS");

  if (!fs.existsSync(analysisDir)) {
    // ANALYSIS klasörü yoksa, boş liste dön
    return res.json([]);
  }

  try {
    const allFiles = fs.readdirSync(analysisDir)
      .filter(f => f.toLowerCase().endsWith("_emotion.txt"))
      .sort();
    return res.json(allFiles);
  } catch (err) {
    return res.status(500).json({ message: "Analiz dosyaları okunamadı", error: err.toString() });
  }
});

// GET /api/analysis/:bookId/:filename
//   → Belirtilen _emotion.txt dosyasını ham metin (text/plain) olarak döner
router.get("/:bookId/:filename", (req, res) => {
  const { bookId, filename } = req.params;
  const filePath = path.join(__dirname, "..", "chapters", bookId, "ANALYSIS", filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "Duygu analizi dosyası bulunamadı" });
  }
  return res.sendFile(filePath);
});

module.exports = router;
