import express from 'express';
import Store from '../models/store.js';

const router = express.Router();

// GET /stores?lat=37.5&lng=127.1&radius=1000&area=서울&si=강남구&category=food
router.get('/', async (req, res) => {
  const { 
    lat, 
    lng, 
    radius = 1000, 
    usable = 'true',
    area,
    si,
    category
  } = req.query;

  // 위치 기반 검색과 지역/카테고리 필터링을 모두 지원
  let query = {};

  // 위치 기반 검색 (lat, lng이 제공된 경우)
  if (lat && lng) {
    query.location = {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)]
        },
        $maxDistance: parseInt(radius)
      }
    };
  }

  // 지역 필터링
  if (area) {
    query.area = area;
  }
  if (si) {
    query.si = si;
  }

  // 카테고리 필터링
  if (category) {
    query.category = category;
  }

  // 사용 가능 여부 필터링
  if (usable === 'true') {
    query.usable_with_fund = true;
  }

  try {
    let storesQuery = Store.find(query);
    
    // 위치 기반 검색이 아닌 경우 정렬 추가
    if (!lat || !lng) {
      storesQuery = storesQuery.sort({ name: 1 });
    }
    
    const stores = await storesQuery.limit(100);

    res.json(stores);
  } catch (err) {
    console.error('매장 조회 오류:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
