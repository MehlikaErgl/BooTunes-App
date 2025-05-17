const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Bağlantısı
mongoose.connect("mongodb+srv://fbbatuhan656:MelihMehlikaBatuhan1907@cluster0.yz0msyc.mongodb.net/BooTunes-App?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("✅ MongoDB bağlantısı başarılı"))
  .catch((err) => console.error("❌ MongoDB bağlantı hatası:", err));

// Multer Ayarları
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Kullanıcı Şeması
const User = mongoose.model("User", new mongoose.Schema({
  email: String,
  password: String
}));

// Kitap Şeması
const Book = mongoose.model("Book", new mongoose.Schema({
  title: String,
  image: String,
  pdfUrl: String,
  userId: String
}));

// API - Kullanıcı Giriş / Kayıt
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

// API - Kitap Ekleme
app.post("/api/books", upload.single("pdf"), async (req, res) => {
  const { title, image, userId } = req.body;
  const pdfUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const book = new Book({ title, image, userId, pdfUrl });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: "Kitap eklenemedi", error: err });
  }
});

// API - Kullanıcının Kitaplarını Getir
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

// API - Tek Kitabı ID ile Getir
app.get("/api/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Kitap bulunamadı" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err });
  }
});

// API - Kitap Sil
app.delete("/api/books/:id", async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Kitap silindi" });
  } catch (err) {
    res.status(500).json({ message: "Silme işlemi başarısız", error: err });
  }
});

// Sunucuyu Başlat
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Sunucu http://localhost:${PORT} üzerinde çalışıyor`);
});
