import express from 'express';
import Store from '../models/store.js';

const router = express.Router();

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
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
