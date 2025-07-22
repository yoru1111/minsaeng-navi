import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import storeRoutes from './routes/stores.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// 미들웨어
app.use(cors());
app.use(express.json());

// 라우터
app.use('/stores', storeRoutes);

// DB 연결 후 서버 실행
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB 연결 완료');
    app.listen(PORT, () => console.log(`🚀 서버 실행 중: http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ DB 연결 실패:', err.message);
  });
