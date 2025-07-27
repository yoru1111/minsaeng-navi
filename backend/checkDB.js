import mongoose from 'mongoose';

async function checkDB() {
  try {
    // MongoDB 연결
    await mongoose.connect('mongodb+srv://jsw11062004:PVoLskNeCrFDm9wy@cluster0.axtl0cz.mongodb.net/minsaeng-navi');
    console.log('MongoDB 연결 성공');

    // 데이터베이스 및 컬렉션 정보 확인
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('\n=== 데이터베이스 정보 ===');
    console.log('데이터베이스명:', db.databaseName);
    console.log('컬렉션 목록:');
    
    for (const collection of collections) {
      const collectionName = collection.name;
      const count = await db.collection(collectionName).countDocuments();
      console.log(`- ${collectionName}: ${count}개 문서`);
      
      // 첫 번째 문서 샘플 조회
      if (count > 0) {
        const sample = await db.collection(collectionName).findOne();
        console.log(`  샘플:`, JSON.stringify(sample, null, 2));
      }
    }

  } catch (error) {
    console.error('오류 발생:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nMongoDB 연결 종료');
  }
}

// 스크립트 실행
checkDB(); 