require('dotenv').config(); 
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const app = express();

const uploadsPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });

const chaptersPath = path.join(__dirname, "chapters");
if (!fs.existsSync(chaptersPath)) fs.mkdirSync(chaptersPath, { recursive: true });

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadsPath));
app.use("/chapters", express.static(chaptersPath));

mongoose.connect(process.env.MONGODB_URI, { family: 4 })
  .then(() => console.log("✅ MongoDB bağlantısı başarılı"))
  .catch(err => console.error("❌ MongoDB bağlantı hatası:", err.message));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsPath),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

const User = mongoose.model("User", new mongoose.Schema({ email: String, password: String }));
const Book = mongoose.model("Book", new mongoose.Schema({ title: String, image: String, pdfUrl: String, userId: String }));

app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Kullanıcı zaten var" });
    const newUser = new User({ email, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: "Kayıt hatası", error: err });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ message: "Geçersiz giriş" });
    res.json({ userId: user._id, email: user.email });
  } catch (err) {
    res.status(500).json({ message: "Giriş hatası", error: err });
  }
});

app.post("/api/books", upload.single("pdf"), async (req, res) => {
  const { title, image, userId } = req.body;
  const pdfUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const book = new Book({ title, image, userId, pdfUrl });
    await book.save();

    const fullPdfPath = path.join(__dirname, pdfUrl);
    const bookChaptersDir = path.join(chaptersPath, book._id.toString());
    if (!fs.existsSync(bookChaptersDir)) fs.mkdirSync(bookChaptersDir, { recursive: true });

    console.log("📄 Split edilecek dosya:", fullPdfPath);
    console.log("📁 Hedef klasör:", bookChaptersDir);

    const command = `python split_pdf_chapters.py "${fullPdfPath}" "${bookChaptersDir}"`;

    exec(command, { cwd: __dirname }, (err, stdout, stderr) => {
      console.log("📤 SPLIT stdout:", stdout);
      console.error("⚠️ SPLIT stderr:", stderr);
      if (err) {
        return res.status(201).json({
          message: "Kitap eklendi ama split sırasında hata oluştu",
          error: stderr,
          book,
        });
      }
      res.status(201).json({ message: "Kitap başarıyla eklendi ve split edildi", book });
    });
  } catch (err) {
    console.error("❌ Kitap eklenemedi:", err);
    res.status(500).json({ message: "Kitap eklenemedi", error: err.message });
  }
});

app.get("/api/books", async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: "userId gerekli" });
  try {
    const books = await Book.find({ userId });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Kitaplar getirilemedi", error: err });
  }
});

app.get("/api/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Kitap bulunamadı" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err });
  }
});

app.delete("/api/books/:id", async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Kitap silindi" });
  } catch (err) {
    res.status(500).json({ message: "Silme başarısız", error: err });
  }
});

app.get("/api/chapters/:bookId", (req, res) => {
  const bookDir = path.join(chaptersPath, req.params.bookId);
  if (!fs.existsSync(bookDir)) return res.status(404).json({ message: "Bölümler bulunamadı" });

  fs.readdir(bookDir, (err, files) => {
    if (err) return res.status(500).json({ message: "Dosyalar okunamadı" });
    const txtFiles = files.filter(f => f.endsWith(".txt")).sort();
    res.json(txtFiles);
  });
});

app.get("/api/chapters/:bookId/:filename", (req, res) => {
  const filePath = path.join(chaptersPath, req.params.bookId, req.params.filename);
  fs.readFile(filePath, "utf8", (err, content) => {
    if (err) return res.status(404).json({ message: "Bölüm bulunamadı" });
    res.json({ content });
  });
});

app.get("/api/fetchImage", async (req, res) => {
  const { query } = req.query;
  if (!query || !query.trim()) return res.status(400).json({ message: "Query gerekli." });

  let browser = null;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36");
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`, { waitUntil: "networkidle0" });
    await page.evaluate(() => window.scrollBy(0, 800));
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.waitForSelector('div[data-attrid="images universal"] img', { timeout: 15000 });

    const thumbUrls = await page.$$eval('div[data-attrid="images universal"] img', imgs =>
      imgs.map(img => img.getAttribute("src") || img.getAttribute("data-src") || "")
    );

    let finalUrl = thumbUrls.find(url => url && !url.startsWith("data:")) || thumbUrls[0];
    if (!finalUrl) throw new Error("Geçerli bir resim URL’si alınamadı.");

    res.json({ imageUrl: finalUrl });
  } catch (err) {
    console.error("🚨 fetchImage hatası:", err);
    res.status(500).json({ message: "Resim alınamadı.", error: err.toString() });
  } finally {
    if (browser) await browser.close();
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Sunucu http://localhost:${PORT} üzerinde çalışıyor`);
});
