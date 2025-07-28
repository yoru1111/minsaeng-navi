import express from 'express';
import Store from '../models/store.js';

const router = express.Router();

// GET /stores?lat=37.5&lng=127.1&radius=1000&area=서울&si=강남구&category=food
router.get('/', async (req, res) => {
  const { 
    lat, 
    lng, 
    radius = 3000, 
    usable = 'true',
    limit = 100,
    area,
    si,
    category
  } = req.query;

   // 디버깅 로그
   console.log("📍 매장 조회 요청:", {
    lat, lng, radius, usable, area, si, category, limit
  });

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


  // 사용 가능 여부 필터링 (충전식 카드, 지류, 모바일 중 하나라도 Y인 경우)
  if (usable === 'true') {
    query.$or = [
      { usable_with_fund: true },
      { supports_rechargeable_card: true },
      { accepts_paper: true },
      { supports_paper_voucher: true },
      { accepts_mobile: true },
      { supports_mobile_payment: true }
    ];
  }

  try {
    let storesQuery = Store.find(query);
    
    // 위치 기반 검색이 아닌 경우 정렬 추가
    if (!lat || !lng) {
      storesQuery = storesQuery.sort({ name: 1 });
    }
    
    const stores = await storesQuery;

            // 각 매장에 사용 가능 여부와 좌표 정보 추가
        const storesWithAvailability = stores.map(store => {
          // 기존 필드와 새 필드 모두 확인
          const usableFund = store.usable_with_fund || store.supports_rechargeable_card || false;
          const acceptsPaper = store.accepts_paper || store.supports_paper_voucher || false;
          const acceptsMobile = store.accepts_mobile || store.supports_mobile_payment || false;
          
          const isAvailable = usableFund || acceptsPaper || acceptsMobile;
          
          return {
            _id: store._id,
            name: store.name,
            address: store.address,
            category: store.category,
            area: store.area,
            si: store.si,
            available: isAvailable,
            usable_with_fund: usableFund,
            accepts_paper: acceptsPaper,
            accepts_mobile: acceptsMobile,
            lat: store.location?.coordinates?.[1] || 0,
            lng: store.location?.coordinates?.[0] || 0,
          };
        });

    res.json(storesWithAvailability);
  } catch (err) {
    console.error('매장 조회 오류:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
