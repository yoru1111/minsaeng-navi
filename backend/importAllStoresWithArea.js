import mongoose from 'mongoose';
import Store from './models/store.js';
import fs from 'fs';
import csv from 'csv-parser';

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

async function importAllStoresWithArea() {
  try {
    // MongoDB 연결
    await mongoose.connect('mongodb+srv://jsw11062004:PVoLskNeCrFDm9wy@cluster0.axtl0cz.mongodb.net/');
    console.log('MongoDB 연결 성공');

    const stores = [];
    let rowCount = 0;
    let importedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // CSV 파일 읽기
    fs.createReadStream('stores.csv')
      .pipe(csv())
      .on('data', (row) => {
        rowCount++;
        
        try {
          // 실제 CSV 컬럼명에 맞게 매핑
          const storeData = {
            name: row['가맹점명'] || '',
            address: row['소재지'] || '',
            category: row['취급품목'] || '',
            location: {
              type: 'Point',
              coordinates: [0, 0] // 주소에서 좌표를 추출해야 함
            },
            usable_with_fund: row['충전식 카드 취급여부'] === 'Y',
            has_coupon_sticker: false, // CSV에 해당 정보 없음
            verified_by_official: false, // CSV에 해당 정보 없음
            is_franchise: false, // CSV에 해당 정보 없음
            is_headstore: false // CSV에 해당 정보 없음
          };

          // 지역 정보 추출
          const { area, si } = extractAreaFromAddress(storeData.address);
          storeData.area = area;
          storeData.si = si;

          // 필수 필드 검증 (이름과 주소만 있으면 저장)
          if (storeData.name && storeData.address) {
            stores.push(storeData);
          } else {
            skippedCount++;
          }

          // 진행상황 출력
          if (rowCount % 1000 === 0) {
            console.log(`${rowCount}개 행 처리 완료`);
          }

        } catch (error) {
          console.error(`행 ${rowCount} 처리 오류:`, error.message);
          errorCount++;
        }
      })
      .on('end', async () => {
        console.log(`\nCSV 파일 읽기 완료!`);
        console.log(`- 총 행 수: ${rowCount}`);
        console.log(`- 유효한 매장: ${stores.length}`);
        console.log(`- 건너뛴 행: ${skippedCount}`);
        console.log(`- 오류: ${errorCount}`);

        // 데이터베이스에 저장
        console.log('\n데이터베이스에 저장 중...');
        
        for (let i = 0; i < stores.length; i += 100) {
          const batch = stores.slice(i, i + 100);
          
          try {
            await Store.insertMany(batch, { ordered: false });
            importedCount += batch.length;
            
            if (importedCount % 1000 === 0) {
              console.log(`${importedCount}개 매장 저장 완료`);
            }
          } catch (error) {
            console.error(`배치 ${i}-${i+100} 저장 오류:`, error.message);
          }
        }

        console.log(`\n저장 완료!`);
        console.log(`- 총 저장된 매장: ${importedCount}개`);

        await mongoose.disconnect();
        console.log('MongoDB 연결 종료');
      });

  } catch (error) {
    console.error('오류 발생:', error);
    await mongoose.disconnect();
  }
}

// 스크립트 실행
importAllStoresWithArea(); 