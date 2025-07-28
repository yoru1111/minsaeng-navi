import express from 'express';

const router = express.Router();

// 네이버 길찾기 API 프록시 엔드포인트
router.get('/directions', async (req, res) => {
  try {
    const { start, goal } = req.query;
    
    if (!start || !goal) {
      return res.status(400).json({ error: '출발지와 도착지가 필요합니다.' });
    }

    // 네이버 API 키 설정
    const CLIENT_ID = process.env.NAVER_CLIENT_ID || '7b1jwmp7eq';
    const CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET || 'your_secret_key';

    const fetch = (await import('node-fetch')).default;
    
    const response = await fetch(
      `https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving?start=${start}&goal=${goal}`,
      {
        headers: {
          'X-NCP-APIGW-API-KEY-ID': CLIENT_ID,
          'X-NCP-APIGW-API-KEY': CLIENT_SECRET,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`네이버 API 오류: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error('길찾기 API 오류:', error);
    res.status(500).json({ 
      error: '길찾기 서비스에 오류가 발생했습니다.',
      details: error.message 
    });
  }
});

export default router; 