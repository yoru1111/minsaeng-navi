import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import csv from 'csv-parser';
import axios from 'axios';
import Store from './models/store.js';

dotenv.config();

const {
  MONGO_URI,
  NAVER_CLIENT_ID,
  NAVER_CLIENT_SECRET,
  NAVER_DAILY_QUOTA,
  NAVER_DAILY_USED
} = process.env;

const CSV_FILE        = 'stores.csv';
const CHECKPOINT_FILE = 'checkpoint.txt';

// 일일 할당량과 사용량 파싱
const dailyQuota = parseInt(NAVER_DAILY_QUOTA, 10) || 3000000;
const dailyUsed  = parseInt(NAVER_DAILY_USED,   10) || 0;
const MAX_PER_DAY = dailyQuota - dailyUsed;

if (!MONGO_URI || !NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
  console.error('❌ .env에 MONGO_URI, NAVER_CLIENT_ID, NAVER_CLIENT_SECRET 설정을 확인하세요.');
  process.exit(1);
}
if (MAX_PER_DAY <= 0) {
  console.error(`❌ 오늘 남은 API 호출 한도가 없습니다 (사용: ${dailyUsed}/${dailyQuota})`);
  process.exit(1);
}

console.log(`▶️ 오늘 남은 API 호출 가능 횟수: ${MAX_PER_DAY}`);

const SLEEP_MS = 500;  // 각 API 호출 사이 대기(ms)
let processed  = 0;    // 오늘 새로 저장된 건수

// 이전에 처리된 CSV 행 번호를 checkpoint.txt에서 읽어오기
let lastProcessedRow = 0;
if (fs.existsSync(CHECKPOINT_FILE)) {
  const saved = parseInt(fs.readFileSync(CHECKPOINT_FILE, 'utf8'), 10);
  if (!Number.isNaN(saved)) lastProcessedRow = saved;
  console.log(`▶️ 이전 실행에서 처리한 마지막 행: ${lastProcessedRow}`);
}

// 체크포인트 비동기 기록 (10행마다)
function writeCheckpoint(rowIndex) {
  fs.writeFile(CHECKPOINT_FILE, String(rowIndex), err => {
    if (err) console.warn(`⚠️ 체크포인트 기록 실패(행 ${rowIndex}): ${err.message}`);
  });
}

// 1) 주소 → 좌표 변환 (Geocoding API)
async function getCoordinatesByAddress(addr) {
  try {
    const res = await axios.get('https://maps.apigw.ntruss.com/map-geocode/v2/geocode', {
      params: { query: addr },
      headers: {
        'X-NCP-APIGW-API-KEY-ID': NAVER_CLIENT_ID,
        'X-NCP-APIGW-API-KEY':    NAVER_CLIENT_SECRET,
      },
    });
    const { addresses } = res.data;
    if (addresses?.length) {
      const { x, y } = addresses[0];
      return [parseFloat(x), parseFloat(y)];
    }
  } catch (err) {
    console.warn(`📍 주소 Geocode 실패 (${addr}):`, err.response?.data || err.message);
  }
  return null;
}

// 2) 매장명 → 장소 검색 → 좌표 변환 (Place Search API)
async function getCoordinatesByPlace(keyword) {
  try {
    const res = await axios.get('https://maps.apigw.ntruss.com/map-place/v1/search', {
      params: {
        query: keyword,
        coordinate: '127.024612,37.532600', // 필요시 중심좌표 조정
        radius: 10000,
      },
      headers: {
        'X-NCP-APIGW-API-KEY-ID': NAVER_CLIENT_ID,
        'X-NCP-APIGW-API-KEY':    NAVER_CLIENT_SECRET,
      },
    });
    const items = res.data.items;
    if (items?.length) {
      const { mapx: x, mapy: y } = items[0];
      return [parseFloat(x), parseFloat(y)];
    }
  } catch (err) {
    console.warn(`📍 장소 검색 실패 (${keyword}):`, err.response?.data || err.message);
  }
  return null;
}

// 메인 실행 함수
async function runImport() {
  // MongoDB 연결
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🟢 MongoDB 연결 성공');
  } catch (err) {
    console.error('❌ MongoDB 연결 실패:', err.message);
    process.exit(1);
  }

  const stream = fs.createReadStream(CSV_FILE).pipe(csv());
  let headerLogged = false;
  let rowIndex     = 0;

  for await (const row of stream) {
    rowIndex++;

    // 중단된 지점 다음부터 시작
    if (rowIndex <= lastProcessedRow) continue;
    // 일일 호출 한도를 초과하면 종료
    if (processed >= MAX_PER_DAY) break;

    // 헤더 로깅
    if (!headerLogged) {
      console.log('📌 CSV 헤더:', Object.keys(row));
      headerLogged = true;
    }

    const rawName  = row['가맹점명'] || row['\uFEFF가맹점명'] || '';
    const name     = rawName.trim();
    const address  = (row['소재지']   || '').trim();
    const category = (row['취급품목'] || '').trim();

    // 필수 필드 체크
    if (!name || !address) {
      console.warn(`⚠️ 필수 필드 누락: name='${name}', address='${address}'`);
      if (rowIndex % 10 === 0) writeCheckpoint(rowIndex);
      continue;
    }

    // 1차: 주소로 시도
    let coords = await getCoordinatesByAddress(address);
    // 2차: 실패 시 매장명으로 장소검색
    if (!coords) {
      console.log(`🔄 주소 실패 → 장소 검색: ${name}`);
      coords = await getCoordinatesByPlace(name);
    }
    if (!coords) {
      console.warn(`❌ 좌표 획득 불가: ${name} / ${address}`);
      if (rowIndex % 10 === 0) writeCheckpoint(rowIndex);
      continue;
    }

    // upsert 로 중복 삽입 방지
    const result = await Store.updateOne(
      { name, address },
      {
        $setOnInsert: {
          category,
          location: { type: 'Point', coordinates: coords },
          usable_with_fund:     true,
          has_coupon_sticker:   false,
          verified_by_official: false,
          is_franchise:         false,
          is_headstore:         false,
        }
      },
      { upsert: true }
    );

    if (result.upsertedCount === 1) {
      processed++;
      console.log(`✅ 신규 저장 (${processed}): ${name}`);
    } else {
      console.log(`⏭️ 이미 존재: ${name}`);
    }

    // 10행마다 체크포인트 갱신
    if (rowIndex % 10 === 0) writeCheckpoint(rowIndex);

    // 다음 호출까지 대기
    await new Promise(res => setTimeout(res, SLEEP_MS));
  }

  console.log(`📦 처리 완료 (오늘 저장: ${processed}건, 남은 호출: ${MAX_PER_DAY - processed})`);
  await mongoose.disconnect();
  console.log('🔌 MongoDB 연결 해제');
}

runImport();
