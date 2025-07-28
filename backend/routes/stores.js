import express from 'express';
import Store from '../models/store.js';

const router = express.Router();

<<<<<<< HEAD
// GET /stores?lat=37.5&lng=127.1&radius=1000
router.get('/', async (req, res) => {
  const { lat, lng, radius = 1000, usable = 'true' } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'lat, lng are required' });
  }

  try {
    const stores = await Store.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      },
      ...(usable === 'true' ? { usable_with_fund: true } : {})
    }).limit(100);

    res.json(stores);
  } catch (err) {
    console.error('매장 조회 오류:', err.message);
=======
// GET /stores?lat=37.5&lng=127.1&radius=3000&usable=true&limit=100
router.get('/', async (req, res) => {
  const { 
    lat, 
    lng, 
    radius = 3000,
    usable = 'true',
    limit = 100, // 클라이언트에서 조절 가능
    area,
    si,
    category
  } = req.query;

  // 디버깅 로그
  console.log("📍 매장 조회 요청:", {
    lat, lng, radius, usable, area, si, category, limit
  });

  let query = {};

  // 위치 기반 검색
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

  // // 지역 필터
  // if (area) query.area = area;
  // if (si) query.si = si;

  // // 카테고리 필터
  // if (category) query.category = category;

  // 사용 가능 여부 필터
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

    // 위치 없으면 이름순 정렬
    if (!lat || !lng) {
      storesQuery = storesQuery.sort({ name: 1 });
    }

    const stores = await storesQuery.limit(parseInt(limit));

    const storesWithMeta = stores.map((store) => {
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

    console.log(`✅ 조회된 매장 수: ${storesWithMeta.length}`);
    res.json(storesWithMeta);
  } catch (err) {
    console.error('❌ 매장 조회 오류:', err.message);
>>>>>>> sub3
    res.status(500).json({ error: 'Internal server error' });
  }
});

<<<<<<< HEAD
export default router;
=======
export default router;
>>>>>>> sub3
