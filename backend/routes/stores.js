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

  // 사용 가능 여부 필터링 (충전식 카드, 지류, 모바일 중 하나라도 Y인 경우)
  if (usable === 'true') {
    query.$or = [
      { usable_with_fund: true },
      { accepts_paper: true },
      { accepts_mobile: true }
    ];
  }

  try {
    let storesQuery = Store.find(query);
    
    // 위치 기반 검색이 아닌 경우 정렬 추가
    if (!lat || !lng) {
      storesQuery = storesQuery.sort({ name: 1 });
    }
    
    const stores = await storesQuery.limit(100);

    // 각 매장에 사용 가능 여부와 좌표 정보 추가
    const storesWithAvailability = stores.map(store => {
      const isAvailable = store.usable_with_fund || store.accepts_paper || store.accepts_mobile;
      return {
        ...store.toObject(),
        available: isAvailable,
        lat: store.location.coordinates[1], // 위도
        lng: store.location.coordinates[0]  // 경도
      };
    });

    res.json(storesWithAvailability);
  } catch (err) {
    console.error('매장 조회 오류:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
