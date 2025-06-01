// test-conn.js
require('dotenv').config();              // .env’i yüklesin
const mongoose = require('mongoose');

console.log('🛠️ Using URI:', process.env.MONGODB_URI);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,                            // SRV + IPv4’e zorlamak için
  })
  .then(() => {
    console.log('✅ MongoDB’ye başarıyla bağlandı!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Bağlantı hatası:', err.message);
    process.exit(1);
  });
