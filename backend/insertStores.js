// insertStores.js
import mongoose from 'mongoose';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// .env 경로 설정
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

// =====================
// 1. Mongoose 모델 정의
// =====================
const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  address: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },
  usable_with_fund: Boolean,
  has_coupon_sticker: Boolean,
  verified_by_official: Boolean,
  is_franchise: Boolean,
  is_headstore: Boolean,
}, { timestamps: true });

storeSchema.index({ location: '2dsphere' });

const Store = mongoose.model('Store', storeSchema);

// ==========================
// 2. NAVER Geocoding API 호출
// ==========================
async function getCoordinates(address) {
  try {
    const url = 'https://maps.apigw.ntruss.com/map-geocode/v2/geocode';
    const headers = {
      'X-NCP-APIGW-API-KEY-ID': process.env.NAVER_CLIENT_ID,
      'X-NCP-APIGW-API-KEY': process.env.NAVER_CLIENT_SECRET,
    };
    const params = { query: address };

    const response = await axios.get(url, { headers, params });
    const data = response.data.addresses?.[0];
    if (!data) throw new Error(`좌표 없음`);

    return [parseFloat(data.x), parseFloat(data.y)]; // [lng, lat]
  } catch (err) {
    throw new Error(`좌표 변환 실패: ${address} (${err.code || err.message})`);
  }
}

// ==============================
// 3. 저장할 가맹점 데이터 (예시)
// ==============================
const storesToInsert = [
  {
    name: '김밥천국 신림점',
    category: '식당',
    address: '서울 관악구 신림로 123',
    usable_with_fund: true,
    has_coupon_sticker: true,
    verified_by_official: false,
    is_franchise: true,
    is_headstore: false,
  },
  {
    name: '영미의류',
    category: '의류',
    address: '대전광역시 서구 둔산로 100', // 주소 교체
    usable_with_fund: true,
    has_coupon_sticker: true,
    verified_by_official: true,
    is_franchise: false,
    is_headstore: false,
  }
];

// ===========================
// 4. MongoDB 연결 및 저장 수행
// ===========================
async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🟢 MongoDB 연결됨');
  } catch (err) {
    console.error('❌ MongoDB 연결 실패:', err.message);
    return;
  }

  for (const store of storesToInsert) {
    try {
      const coordinates = await getCoordinates(store.address);
      const newStore = new Store({
        ...store,
        location: { type: 'Point', coordinates }
      });
      await newStore.save();
      console.log(`✅ 저장됨: ${store.name}`);
    } catch (err) {
      console.warn(`⚠️ 저장 실패: ${store.name} → ${err.message}`);
    }
  }

  mongoose.disconnect();
}

main();

