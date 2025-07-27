import mongoose from 'mongoose';
import Store from './models/store.js';

// 주소에서 지역 정보 추출하는 함수
function extractAreaFromAddress(address) {
  if (!address) return { area: '', si: '' };
  
  // 서울특별시
  if (address.includes('서울특별시') || address.includes('서울시')) {
    const match = address.match(/서울특별시\s*([^\s]+)/);
    if (match) {
      return { area: '서울', si: match[1] };
    }
    return { area: '서울', si: '' };
  }
  
  // 부산광역시
  if (address.includes('부산광역시') || address.includes('부산시')) {
    const match = address.match(/부산광역시\s*([^\s]+)/);
    if (match) {
      return { area: '부산', si: match[1] };
    }
    return { area: '부산', si: '' };
  }
  
  // 대구광역시
  if (address.includes('대구광역시') || address.includes('대구시')) {
    const match = address.match(/대구광역시\s*([^\s]+)/);
    if (match) {
      return { area: '대구', si: match[1] };
    }
    return { area: '대구', si: '' };
  }
  
  // 인천광역시
  if (address.includes('인천광역시') || address.includes('인천시')) {
    const match = address.match(/인천광역시\s*([^\s]+)/);
    if (match) {
      return { area: '인천', si: match[1] };
    }
    return { area: '인천', si: '' };
  }
  
  // 광주광역시
  if (address.includes('광주광역시') || address.includes('광주시')) {
    const match = address.match(/광주광역시\s*([^\s]+)/);
    if (match) {
      return { area: '광주', si: match[1] };
    }
    return { area: '광주', si: '' };
  }
  
  // 대전광역시
  if (address.includes('대전광역시') || address.includes('대전시')) {
    const match = address.match(/대전광역시\s*([^\s]+)/);
    if (match) {
      return { area: '대전', si: match[1] };
    }
    return { area: '대전', si: '' };
  }
  
  // 울산광역시
  if (address.includes('울산광역시') || address.includes('울산시')) {
    const match = address.match(/울산광역시\s*([^\s]+)/);
    if (match) {
      return { area: '울산', si: match[1] };
    }
    return { area: '울산', si: '' };
  }
  
  // 세종특별자치시
  if (address.includes('세종특별자치시') || address.includes('세종시')) {
    return { area: '세종', si: '' };
  }
  
  // 경기도
  if (address.includes('경기도') || address.includes('경기')) {
    const match = address.match(/경기도\s*([^\s]+)/);
    if (match) {
      return { area: '경기', si: match[1] };
    }
    return { area: '경기', si: '' };
  }
  
  // 강원도
  if (address.includes('강원도') || address.includes('강원')) {
    const match = address.match(/강원도\s*([^\s]+)/);
    if (match) {
      return { area: '강원', si: match[1] };
    }
    return { area: '강원', si: '' };
  }
  
  // 충청북도
  if (address.includes('충청북도') || address.includes('충북')) {
    const match = address.match(/충청북도\s*([^\s]+)/);
    if (match) {
      return { area: '충북', si: match[1] };
    }
    return { area: '충북', si: '' };
  }
  
  // 충청남도
  if (address.includes('충청남도') || address.includes('충남')) {
    const match = address.match(/충청남도\s*([^\s]+)/);
    if (match) {
      return { area: '충남', si: match[1] };
    }
    return { area: '충남', si: '' };
  }
  
  // 전라북도
  if (address.includes('전라북도') || address.includes('전북')) {
    const match = address.match(/전라북도\s*([^\s]+)/);
    if (match) {
      return { area: '전북', si: match[1] };
    }
    return { area: '전북', si: '' };
  }
  
  // 전라남도
  if (address.includes('전라남도') || address.includes('전남')) {
    const match = address.match(/전라남도\s*([^\s]+)/);
    if (match) {
      return { area: '전남', si: match[1] };
    }
    return { area: '전남', si: '' };
  }
  
  // 경상북도
  if (address.includes('경상북도') || address.includes('경북')) {
    const match = address.match(/경상북도\s*([^\s]+)/);
    if (match) {
      return { area: '경북', si: match[1] };
    }
    return { area: '경북', si: '' };
  }
  
  // 경상남도
  if (address.includes('경상남도') || address.includes('경남')) {
    const match = address.match(/경상남도\s*([^\s]+)/);
    if (match) {
      return { area: '경남', si: match[1] };
    }
    return { area: '경남', si: '' };
  }
  
  // 제주특별자치도
  if (address.includes('제주특별자치도') || address.includes('제주도') || address.includes('제주')) {
    const match = address.match(/제주특별자치도\s*([^\s]+)/);
    if (match) {
      return { area: '제주', si: match[1] };
    }
    return { area: '제주', si: '' };
  }
  
  return { area: '', si: '' };
}

async function updateStoresWithArea() {
  try {
    // MongoDB 연결
    await mongoose.connect('mongodb+srv://jsw11062004:PVoLskNeCrFDm9wy@cluster0.axtl0cz.mongodb.net/minsaeng-navi?retryWrites=true&w=majority');
    console.log('MongoDB 연결 성공');

    // 모든 매장 조회
    const stores = await Store.find({});
    console.log(`총 ${stores.length}개의 매장을 찾았습니다.`);

    let updatedCount = 0;
    let errorCount = 0;

    for (const store of stores) {
      try {
        const { area, si } = extractAreaFromAddress(store.address);
        
        // area나 si가 비어있지 않은 경우에만 업데이트
        if (area || si) {
          await Store.updateOne(
            { _id: store._id },
            { 
              $set: { 
                area: area || store.area || '',
                si: si || store.si || ''
              }
            }
          );
          updatedCount++;
          
          if (updatedCount % 100 === 0) {
            console.log(`${updatedCount}개 매장 업데이트 완료`);
          }
        }
      } catch (error) {
        console.error(`매장 ${store.name} 업데이트 실패:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n업데이트 완료!`);
    console.log(`- 성공: ${updatedCount}개`);
    console.log(`- 실패: ${errorCount}개`);

  } catch (error) {
    console.error('오류 발생:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB 연결 종료');
  }
}

// 스크립트 실행
updateStoresWithArea(); 