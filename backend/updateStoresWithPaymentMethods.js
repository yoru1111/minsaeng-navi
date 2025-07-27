import mongoose from 'mongoose';
import Store from './models/store.js';

async function updateStoresWithPaymentMethods() {
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
        // 기존 usable_with_fund 필드를 기반으로 새로운 필드들 설정
        // 실제 데이터에서는 CSV 파일의 컬럼을 확인해서 매핑해야 함
        const updateData = {
          // 기존 usable_with_fund는 그대로 유지
          usable_with_fund: store.usable_with_fund || false,
          // 새로운 필드들 추가 (기본값은 false)
          accepts_paper: false,  // 지류 취급여부
          accepts_mobile: false  // 모바일 취급여부
        };

        await Store.updateOne(
          { _id: store._id },
          { $set: updateData }
        );
        updatedCount++;
        
        if (updatedCount % 100 === 0) {
          console.log(`${updatedCount}개 매장 업데이트 완료`);
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
updateStoresWithPaymentMethods(); 