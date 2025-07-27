import mongoose from 'mongoose';
import fs from 'fs';
import csv from 'csv-parser';
import Store from './models/store.js';

// 지역 정보 추출 함수
function extractAreaFromAddress(address) {
  if (!address) return { area: '', si: '' };
  
  // 서울특별시
  if (address.includes('서울특별시') || address.includes('서울시')) {
    const match = address.match(/서울특별시\s*([^\s]+)/);
    if (match) {
      return { area: '서울특별시', si: match[1] };
    }
    return { area: '서울특별시', si: '' };
  }
  
  // 부산광역시
  if (address.includes('부산광역시') || address.includes('부산시')) {
    const match = address.match(/부산광역시\s*([^\s]+)/);
    if (match) {
      return { area: '부산광역시', si: match[1] };
    }
    return { area: '부산광역시', si: '' };
  }
  
  // 대구광역시
  if (address.includes('대구광역시') || address.includes('대구시')) {
    const match = address.match(/대구광역시\s*([^\s]+)/);
    if (match) {
      return { area: '대구광역시', si: match[1] };
    }
    return { area: '대구광역시', si: '' };
  }
  
  // 인천광역시
  if (address.includes('인천광역시') || address.includes('인천시')) {
    const match = address.match(/인천광역시\s*([^\s]+)/);
    if (match) {
      return { area: '인천광역시', si: match[1] };
    }
    return { area: '인천광역시', si: '' };
  }
  
  // 광주광역시
  if (address.includes('광주광역시') || address.includes('광주시')) {
    const match = address.match(/광주광역시\s*([^\s]+)/);
    if (match) {
      return { area: '광주광역시', si: match[1] };
    }
    return { area: '광주광역시', si: '' };
  }
  
  // 대전광역시
  if (address.includes('대전광역시') || address.includes('대전시')) {
    const match = address.match(/대전광역시\s*([^\s]+)/);
    if (match) {
      return { area: '대전광역시', si: match[1] };
    }
    return { area: '대전광역시', si: '' };
  }
  
  // 울산광역시
  if (address.includes('울산광역시') || address.includes('울산시')) {
    const match = address.match(/울산광역시\s*([^\s]+)/);
    if (match) {
      return { area: '울산광역시', si: match[1] };
    }
    return { area: '울산광역시', si: '' };
  }
  
  // 세종특별자치시
  if (address.includes('세종특별자치시') || address.includes('세종시')) {
    return { area: '세종특별자치시', si: '' };
  }
  
  // 경기도
  if (address.includes('경기도')) {
    const match = address.match(/경기도\s*([^\s]+)/);
    if (match) {
      return { area: '경기도', si: match[1] };
    }
    return { area: '경기도', si: '' };
  }
  
  // 강원도 (강원특별자치도)
  if (address.includes('강원도') || address.includes('강원특별자치도')) {
    const match = address.match(/강원(?:특별자치)?도\s*([^\s]+)/);
    if (match) {
      return { area: '강원특별자치도', si: match[1] };
    }
    return { area: '강원특별자치도', si: '' };
  }
  
  // 충청북도
  if (address.includes('충청북도') || address.includes('충북')) {
    const match = address.match(/충청북도\s*([^\s]+)/);
    if (match) {
      return { area: '충청북도', si: match[1] };
    }
    return { area: '충청북도', si: '' };
  }
  
  // 충청남도
  if (address.includes('충청남도') || address.includes('충남')) {
    const match = address.match(/충청남도\s*([^\s]+)/);
    if (match) {
      return { area: '충청남도', si: match[1] };
    }
    return { area: '충청남도', si: '' };
  }
  
  // 전라북도
  if (address.includes('전라북도') || address.includes('전북')) {
    const match = address.match(/전라북도\s*([^\s]+)/);
    if (match) {
      return { area: '전라북도', si: match[1] };
    }
    return { area: '전라북도', si: '' };
  }
  
  // 전라남도
  if (address.includes('전라남도') || address.includes('전남')) {
    const match = address.match(/전라남도\s*([^\s]+)/);
    if (match) {
      return { area: '전라남도', si: match[1] };
    }
    return { area: '전라남도', si: '' };
  }
  
  // 경상북도
  if (address.includes('경상북도') || address.includes('경북')) {
    const match = address.match(/경상북도\s*([^\s]+)/);
    if (match) {
      return { area: '경상북도', si: match[1] };
    }
    return { area: '경상북도', si: '' };
  }
  
  // 경상남도
  if (address.includes('경상남도') || address.includes('경남')) {
    const match = address.match(/경상남도\s*([^\s]+)/);
    if (match) {
      return { area: '경상남도', si: match[1] };
    }
    return { area: '경상남도', si: '' };
  }
  
  // 제주특별자치도
  if (address.includes('제주특별자치도') || address.includes('제주도') || address.includes('제주')) {
    const match = address.match(/제주특별자치도\s*([^\s]+)/);
    if (match) {
      return { area: '제주특별자치도', si: match[1] };
    }
    return { area: '제주특별자치도', si: '' };
  }
  
  return { area: '', si: '' };
}

// 좌표 변환 함수 (WGS84)
function parseCoordinates(lng, lat) {
  const parsedLng = parseFloat(lng);
  const parsedLat = parseFloat(lat);
  
  // 유효한 좌표인지 확인
  if (isNaN(parsedLng) || isNaN(parsedLat) || 
      parsedLng === 0 || parsedLat === 0 ||
      parsedLng < -180 || parsedLng > 180 ||
      parsedLat < -90 || parsedLat > 90) {
    return null;
  }
  
  return {
    lng: parsedLng,
    lat: parsedLat
  };
}

async function importStoresFromCSV() {
  try {
    // MongoDB 연결
    await mongoose.connect('mongodb+srv://jsw11062004:PVoLskNeCrFDm9wy@cluster0.axtl0cz.mongodb.net/');
    console.log('MongoDB 연결 성공');

    // 기존 데이터 삭제
    await Store.deleteMany({});
    console.log('기존 데이터 삭제 완료');

         const stores = [];
     let processedCount = 0;
     let errorCount = 0;
     const maxProcessCount = 10; // 테스트용 제한

     // CSV 파일 읽기
     fs.createReadStream('./stores.csv')
       .pipe(csv())
       .on('data', (row) => {
         try {
           // 처리 개수 제한 (테스트용)
           if (processedCount >= maxProcessCount) {
             return;
           }
           
           // CSV 컬럼 매핑 (한글 헤더 기준)
           if (processedCount < 3) { // 처음 3개만 디버깅 로그
             console.log('CSV Row keys:', Object.keys(row));
             console.log('Sample row data:', row);
           }
           
           const name = row['가맹점명'] || row['업체명'] || row['상호명'] || '';
           const address = row['주소'] || row['소재지'] || '';
           const category = row['업종'] || row['업태'] || '';
           
           // 좌표 정보 
           const lng = row['경도'] || row['X좌표'] || '';
           const lat = row['위도'] || row['Y좌표'] || '';
           
           // 결제 수단 정보 (Y/N 형태)
           const supportsCard = (row['충전식 카드 취급여부'] || '').trim() === 'Y';
           const supportsPaper = (row['지류 취급여부'] || '').trim() === 'Y'; 
           const supportsMobile = (row['모바일 취급여부'] || '').trim() === 'Y';

          // 유효성 검사
          if (!name || name === '#NAME?' || !address) {
            console.warn('유효하지 않은 데이터 스킵:', { name, address });
            errorCount++;
            return;
          }

          // 좌표 파싱
          const coordinates = parseCoordinates(lng, lat);
          if (!coordinates) {
            console.warn(`좌표가 유효하지 않은 매장 스킵: ${name} - lng: ${lng}, lat: ${lat}`);
            errorCount++;
            return;
          }

          // 지역 정보 추출
          const { area, si } = extractAreaFromAddress(address);

          // Store 객체 생성
          const storeData = {
            name: name.trim(),
            address: address.trim(),
            area: area,
            si: si,
            category: category.trim(),
            location: {
              type: 'Point',
              coordinates: [coordinates.lng, coordinates.lat]
            },
            usable_with_fund: supportsCard,
            accepts_paper: supportsPaper,
            accepts_mobile: supportsMobile,
            has_coupon_sticker: false,
            verified_by_official: false,
            is_franchise: false,
            is_headstore: false
          };

          stores.push(storeData);
          processedCount++;

          if (processedCount % 1000 === 0) {
            console.log(`${processedCount}개 매장 처리 완료`);
          }

        } catch (error) {
          console.error('행 처리 오류:', error.message);
          errorCount++;
        }
      })
      .on('end', async () => {
        try {
          console.log(`\nCSV 파싱 완료:`);
          console.log(`- 처리된 매장: ${processedCount}개`);
          console.log(`- 오류: ${errorCount}개`);
          console.log(`- 삽입할 매장: ${stores.length}개`);

          if (stores.length > 0) {
            // 배치 삽입 (성능 최적화)
            const batchSize = 1000;
            let insertedCount = 0;

            for (let i = 0; i < stores.length; i += batchSize) {
              const batch = stores.slice(i, i + batchSize);
              try {
                await Store.insertMany(batch, { ordered: false });
                insertedCount += batch.length;
                console.log(`${insertedCount}/${stores.length} 매장 삽입 완료`);
              } catch (error) {
                console.error(`배치 삽입 오류:`, error.message);
                // 개별 삽입 시도
                for (const store of batch) {
                  try {
                    await Store.create(store);
                    insertedCount++;
                  } catch (individualError) {
                    console.error(`개별 매장 삽입 실패: ${store.name}`, individualError.message);
                  }
                }
              }
            }

            console.log(`\n=== 최종 결과 ===`);
            console.log(`성공적으로 삽입된 매장: ${insertedCount}개`);
            
            // 샘플 데이터 확인
            const sampleStore = await Store.findOne({});
            if (sampleStore) {
              console.log('\n=== 샘플 데이터 ===');
              console.log(JSON.stringify(sampleStore, null, 2));
            }
          }

        } catch (finalError) {
          console.error('최종 처리 오류:', finalError);
        } finally {
          await mongoose.disconnect();
          console.log('MongoDB 연결 종료');
        }
      })
      .on('error', (error) => {
        console.error('CSV 읽기 오류:', error);
      });

  } catch (error) {
    console.error('연결 오류:', error);
  }
}

// 스크립트 실행
importStoresFromCSV(); 