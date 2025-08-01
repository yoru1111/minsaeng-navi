import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import DirectionsBox from "../components/DirectionsBox";
import NaverMap from "../components/NaverMap";

function Tab2MapPage() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.9780 }); // 서울
  const [mapInstance, setMapInstance] = useState(null);

  // 도별 중심 좌표
  const regionCenterMap = useMemo(() => ({
    "서울특별시": { lat: 37.5665, lng: 126.9780 },
    "부산광역시": { lat: 35.1796, lng: 129.0756 },
    "대구광역시": { lat: 35.8714, lng: 128.6014 },
    "인천광역시": { lat: 37.4563, lng: 126.7052 },
    "광주광역시": { lat: 35.1595, lng: 126.8526 },
    "대전광역시": { lat: 36.3504, lng: 127.3845 },
    "울산광역시": { lat: 35.5384, lng: 129.3114 },
    "세종특별자치시": { lat: 36.4801, lng: 127.289 },
    "경기도": { lat: 37.4138, lng: 127.5183 },
    "강원특별자치도": { lat: 37.8228, lng: 128.1555 },
    "충청북도": { lat: 36.8, lng: 127.7 },
    "충청남도": { lat: 36.4, lng: 126.8 },
    "전라북도": { lat: 35.8, lng: 127.1 },
    "전라남도": { lat: 34.8, lng: 126.5 },
    "경상북도": { lat: 36.5, lng: 128.7 },
    "경상남도": { lat: 35.3, lng: 128.3 },
    "제주특별자치도": { lat: 33.4996, lng: 126.5312 },
  }), []);

  // 시군구별 중심 좌표 (주요 지역들)
  const siCenterMap = useMemo(() => ({
    // 서울특별시
    "강남구": { lat: 37.5172, lng: 127.0473 },
    "강동구": { lat: 37.5301, lng: 127.1238 },
    "강북구": { lat: 37.6396, lng: 127.0257 },
    "강서구": { lat: 37.5509, lng: 126.8495 },
    "관악구": { lat: 37.4784, lng: 126.9516 },
    "광진구": { lat: 37.5384, lng: 127.0822 },
    "구로구": { lat: 37.4954, lng: 126.8874 },
    "금천구": { lat: 37.4600, lng: 126.9006 },
    "노원구": { lat: 37.6542, lng: 127.0568 },
    "도봉구": { lat: 37.6688, lng: 127.0471 },
    "동대문구": { lat: 37.5744, lng: 127.0395 },
    "동작구": { lat: 37.5124, lng: 126.9393 },
    "마포구": { lat: 37.5637, lng: 126.9085 },
    "서대문구": { lat: 37.5791, lng: 126.9368 },
    "서초구": { lat: 37.4837, lng: 127.0324 },
    "성동구": { lat: 37.5506, lng: 127.0409 },
    "성북구": { lat: 37.5894, lng: 127.0167 },
    "송파구": { lat: 37.5145, lng: 127.1059 },
    "양천구": { lat: 37.5270, lng: 126.8562 },
    "영등포구": { lat: 37.5264, lng: 126.8962 },
    "용산구": { lat: 37.5384, lng: 126.9654 },
    "은평구": { lat: 37.6027, lng: 126.9291 },
    "종로구": { lat: 37.5735, lng: 126.9788 },
    "중구": { lat: 37.5641, lng: 126.9979 },
    "중랑구": { lat: 37.6064, lng: 127.0926 },

    // 경기도
    "수원시": { lat: 37.2636, lng: 127.0286 },
    "성남시": { lat: 37.4449, lng: 127.1389 },
    "고양시": { lat: 37.6584, lng: 126.8320 },
    "용인시": { lat: 37.2411, lng: 127.1776 },
    "부천시": { lat: 37.5035, lng: 126.7660 },
    "안산시": { lat: 37.3219, lng: 126.8309 },
    "안양시": { lat: 37.3943, lng: 126.9568 },
    "평택시": { lat: 36.9920, lng: 127.1127 },
    "시흥시": { lat: 37.3799, lng: 126.8031 },
    "광명시": { lat: 37.4792, lng: 126.8649 },
    "김포시": { lat: 37.6154, lng: 126.7155 },
    "광주시": { lat: 37.4294, lng: 127.2550 },
    "이천시": { lat: 37.2720, lng: 127.4350 },
    "여주시": { lat: 37.2984, lng: 127.6370 },
    "양평군": { lat: 37.4910, lng: 127.4874 },
    "포천시": { lat: 37.8949, lng: 127.2002 },
    "동두천시": { lat: 37.9036, lng: 127.0606 },
    "과천시": { lat: 37.4290, lng: 126.9877 },
    "구리시": { lat: 37.5944, lng: 127.1296 },
    "남양주시": { lat: 37.6369, lng: 127.2167 },
    "오산시": { lat: 37.1498, lng: 127.0772 },
    "군포시": { lat: 37.3616, lng: 126.9352 },
    "하남시": { lat: 37.5392, lng: 127.2148 },
    "의왕시": { lat: 37.3449, lng: 126.9483 },
    "의정부시": { lat: 37.7381, lng: 127.0337 },
    "파주시": { lat: 37.8154, lng: 126.7929 },

    // 부산광역시
    "부산_중구": { lat: 35.1064, lng: 129.0323 },
    "부산_서구": { lat: 35.0979, lng: 129.0244 },
    "부산_동구": { lat: 35.1294, lng: 129.0454 },
    "영도구": { lat: 35.0912, lng: 129.0677 },
    "부산진구": { lat: 35.1626, lng: 129.0530 },
    "동래구": { lat: 35.2055, lng: 129.0784 },
    "부산_남구": { lat: 35.1366, lng: 129.0829 },
    "부산_북구": { lat: 35.1972, lng: 128.9914 },
    "해운대구": { lat: 35.1630, lng: 129.1636 },
    "사하구": { lat: 35.1047, lng: 128.9740 },
    "금정구": { lat: 35.2431, lng: 129.0922 },
    "부산_강서구": { lat: 35.2124, lng: 128.9804 },
    "연제구": { lat: 35.1764, lng: 129.0799 },
    "수영구": { lat: 35.1455, lng: 129.1130 },
    "사상구": { lat: 35.1527, lng: 128.9910 },
    "기장군": { lat: 35.2444, lng: 129.2222 },

    // 대구광역시
    "대구_중구": { lat: 35.8861, lng: 128.6063 },
    "대구_동구": { lat: 35.8864, lng: 128.6353 },
    "대구_서구": { lat: 35.8719, lng: 128.5647 },
    "대구_남구": { lat: 35.8461, lng: 128.5973 },
    "대구_북구": { lat: 35.8854, lng: 128.5828 },
    "수성구": { lat: 35.8581, lng: 128.6309 },
    "달서구": { lat: 35.8298, lng: 128.5287 },
    "달성군": { lat: 35.7746, lng: 128.4311 },

    // 인천광역시
    "인천_중구": { lat: 37.4738, lng: 126.6248 },
    "인천_동구": { lat: 37.4738, lng: 126.6448 },
    "미추홀구": { lat: 37.4634, lng: 126.6500 },
    "연수구": { lat: 37.4106, lng: 126.6788 },
    "남동구": { lat: 37.4471, lng: 126.7310 },
    "부평구": { lat: 37.5070, lng: 126.7219 },
    "계양구": { lat: 37.5372, lng: 126.7374 },
    "인천_서구": { lat: 37.5457, lng: 126.6756 },
    "강화군": { lat: 37.7464, lng: 126.4880 },
    "옹진군": { lat: 37.4464, lng: 126.6370 },

    // 광주광역시
    "광주_동구": { lat: 35.1460, lng: 126.9231 },
    "광주_서구": { lat: 35.1497, lng: 126.8526 },
    "광주_남구": { lat: 35.1333, lng: 126.9010 },
    "광주_북구": { lat: 35.1747, lng: 126.9124 },
    "광산구": { lat: 35.1398, lng: 126.7939 },

    // 대전광역시
    "대전_동구": { lat: 36.3484, lng: 127.4156 },
    "대전_중구": { lat: 36.3256, lng: 127.4215 },
    "대전_서구": { lat: 36.3504, lng: 127.3845 },
    "유성구": { lat: 36.3624, lng: 127.3566 },
    "대덕구": { lat: 36.3475, lng: 127.4337 },

    // 울산광역시
    "울산_중구": { lat: 35.5683, lng: 129.3324 },
    "남구": { lat: 35.5431, lng: 129.3297 },
    "동구": { lat: 35.5047, lng: 129.4163 },
    "북구": { lat: 35.5824, lng: 129.3614 },
    "울주군": { lat: 35.5227, lng: 129.2424 },

    // 강원특별자치도
    "춘천시": { lat: 37.8813, lng: 127.7300 },
    "원주시": { lat: 37.3422, lng: 127.9202 },
    "강릉시": { lat: 37.7519, lng: 128.8759 },
    "동해시": { lat: 37.5236, lng: 129.1143 },
    "태백시": { lat: 37.1641, lng: 128.9857 },
    "속초시": { lat: 38.2070, lng: 128.5918 },
    "삼척시": { lat: 37.4499, lng: 129.1652 },
    "홍천군": { lat: 37.6979, lng: 127.8885 },
    "횡성군": { lat: 37.4911, lng: 127.9852 },
    "영월군": { lat: 37.1837, lng: 128.4617 },
    "평창군": { lat: 37.3705, lng: 128.3902 },
    "정선군": { lat: 37.3807, lng: 128.6608 },
    "철원군": { lat: 38.1466, lng: 127.3132 },
    "화천군": { lat: 38.1064, lng: 127.7082 },
    "양구군": { lat: 38.1074, lng: 127.9897 },
    "인제군": { lat: 38.0695, lng: 128.1707 },
    "강원_고성군": { lat: 38.3775, lng: 128.4677 },
    "양양군": { lat: 38.0754, lng: 128.6191 },

    // 충청북도
    "청주시": { lat: 36.6424, lng: 127.4890 },
    "충주시": { lat: 36.9910, lng: 127.9260 },
    "제천시": { lat: 37.1326, lng: 128.2110 },
    "보은군": { lat: 36.4894, lng: 127.7292 },
    "옥천군": { lat: 36.3064, lng: 127.5717 },
    "영동군": { lat: 36.1750, lng: 127.7765 },
    "진천군": { lat: 36.8550, lng: 127.4350 },
    "괴산군": { lat: 36.8157, lng: 127.7867 },
    "음성군": { lat: 36.9404, lng: 127.6909 },
    "단양군": { lat: 36.9845, lng: 128.3655 },

    // 충청남도
    "천안시": { lat: 36.8151, lng: 127.1139 },
    "아산시": { lat: 36.7897, lng: 127.0017 },
    "서산시": { lat: 36.7849, lng: 126.4503 },
    "논산시": { lat: 36.1871, lng: 127.0988 },
    "공주시": { lat: 36.4464, lng: 127.1190 },
    "보령시": { lat: 36.3333, lng: 126.6127 },
    "계룡시": { lat: 36.2749, lng: 127.2489 },
    "당진시": { lat: 36.8933, lng: 126.6283 },
    "금산군": { lat: 36.1084, lng: 127.4882 },
    "부여군": { lat: 36.2754, lng: 126.9097 },
    "서천군": { lat: 36.0803, lng: 126.6919 },
    "청양군": { lat: 36.4594, lng: 126.8027 },
    "홍성군": { lat: 36.6009, lng: 126.6650 },
    "예산군": { lat: 36.6817, lng: 126.8450 },
    "태안군": { lat: 36.7459, lng: 126.2979 },

    // 전라북도
    "전주시": { lat: 35.8242, lng: 127.1480 },
    "군산시": { lat: 35.9674, lng: 126.7369 },
    "익산시": { lat: 35.9483, lng: 126.9579 },
    "정읍시": { lat: 35.5699, lng: 126.8560 },
    "남원시": { lat: 35.4164, lng: 127.3904 },
    "김제시": { lat: 35.8036, lng: 126.8808 },
    "완주군": { lat: 35.9047, lng: 127.1627 },
    "진안군": { lat: 35.7910, lng: 127.4252 },
    "무주군": { lat: 36.0070, lng: 127.6608 },
    "장수군": { lat: 35.6474, lng: 127.5205 },
    "임실군": { lat: 35.6174, lng: 127.2890 },
    "순창군": { lat: 35.3744, lng: 127.1376 },

    // 전라남도
    "여수시": { lat: 34.7604, lng: 127.6622 },
    "순천시": { lat: 34.9506, lng: 127.4874 },
    "목포시": { lat: 34.8118, lng: 126.3928 },
    "나주시": { lat: 35.0156, lng: 126.7108 },
    "광양시": { lat: 34.9404, lng: 127.6958 },
    "담양군": { lat: 35.3214, lng: 126.9883 },
    "곡성군": { lat: 35.2824, lng: 127.2924 },
    "구례군": { lat: 35.2024, lng: 127.4624 },
    "고흥군": { lat: 34.6124, lng: 127.2824 },
    "보성군": { lat: 34.7324, lng: 127.0824 },
    "화순군": { lat: 35.0624, lng: 126.9824 },
    "장흥군": { lat: 34.6824, lng: 126.9024 },
    "강진군": { lat: 34.6424, lng: 126.7624 },
    "해남군": { lat: 34.5724, lng: 126.6024 },
    "영암군": { lat: 34.8024, lng: 126.7024 },
    "무안군": { lat: 34.9924, lng: 126.4824 },
    "신안군": { lat: 34.7924, lng: 126.3824 },

    // 경상북도
    "포항시": { lat: 36.0320, lng: 129.3650 },
    "경주시": { lat: 35.8562, lng: 129.2247 },
    "구미시": { lat: 36.1194, lng: 128.3446 },
    "김천시": { lat: 36.1398, lng: 128.1139 },
    "안동시": { lat: 36.5684, lng: 128.7294 },
    "영주시": { lat: 36.8059, lng: 128.6241 },
    "영천시": { lat: 35.9733, lng: 128.9387 },
    "상주시": { lat: 36.4108, lng: 128.1590 },
    "문경시": { lat: 36.5866, lng: 128.1865 },
    "예천군": { lat: 36.6577, lng: 128.4567 },
    "봉화군": { lat: 36.8895, lng: 128.7325 },
    "울진군": { lat: 36.9937, lng: 129.4004 },
    "울릉군": { lat: 37.4844, lng: 130.9058 },

    // 경상남도
    "창원시": { lat: 35.2278, lng: 128.6817 },
    "진주시": { lat: 35.1806, lng: 128.1087 },
    "김해시": { lat: 35.2284, lng: 128.8893 },
    "양산시": { lat: 35.3386, lng: 129.0344 },
    "거제시": { lat: 34.8805, lng: 128.6211 },
    "통영시": { lat: 34.8544, lng: 128.4331 },
    "밀양시": { lat: 35.5035, lng: 128.7464 },
    "사천시": { lat: 35.0035, lng: 128.0640 },
    "함안군": { lat: 35.2724, lng: 128.4084 },
    "의령군": { lat: 35.3224, lng: 128.2624 },
    "창녕군": { lat: 35.5024, lng: 128.5024 },
    "경남_고성군": { lat: 34.9724, lng: 128.3224 },
    "남해군": { lat: 34.8374, lng: 127.8924 },
    "하동군": { lat: 35.0624, lng: 127.7524 },

    // 제주특별자치도
    "제주시": { lat: 33.4996, lng: 126.5312 },
    "서귀포시": { lat: 33.2541, lng: 126.5600 },
  }), []);

  // 지역 선택 시 지도 이동 함수 (useCallback으로 최적화)
  const moveToRegion = useCallback((doName, siName = null) => {
    let targetCenter;
    
    if (siName) {
      // 시군구 좌표 찾기 - 도시명과 시군구명을 조합해서 키 생성
      const siKey = `${doName}_${siName}`;
      if (siCenterMap[siKey]) {
        // 조합된 키로 찾기 (예: "부산_중구")
        targetCenter = siCenterMap[siKey];
      } else if (siCenterMap[siName]) {
        // 단순 시군구명으로 찾기 (서울의 경우)
        targetCenter = siCenterMap[siName];
      }
    }
    
    if (!targetCenter && regionCenterMap[doName]) {
      // 시군구를 찾지 못했으면 도 중심으로 이동
      targetCenter = regionCenterMap[doName];
    }
    
    if (!targetCenter) {
      // 기본값 (서울)
      targetCenter = { lat: 37.5665, lng: 126.9780 };
    }

    setCenter(targetCenter);
    
    // 지도 인스턴스가 있으면 부드럽게 이동
    if (mapInstance) {
      mapInstance.panTo(new window.naver.maps.LatLng(targetCenter.lat, targetCenter.lng));
    }
  }, [mapInstance, regionCenterMap, siCenterMap]);

  // 초기: 도 단위 중심 설정 및 상태 초기화
  useEffect(() => {
    console.log("🌍 [Tab2] location 변경 감지");
    if (location.state?.area) {
      const region = location.state.area;
      const si = location.state.si;
      console.log(`🗺️ [Tab2] 지역 이동: ${region} > ${si || '전체'}`);
      moveToRegion(region, si);
      
      // 지역이 변경되었으므로 이전 선택 상태 초기화
      setSelectedStore(null);
      setSearchTerm("");
      console.log("✅ [Tab2] 상태 초기화 완료");
    } else {
      console.log("❌ [Tab2] location.state.area가 없음");
    }
  }, [location, moveToRegion]);

  // 매장 데이터 로드 (백엔드에서 필터링하여 가져오기)
  useEffect(() => {
    console.log("📊 매장 데이터 로딩 시작...");
    console.log("📊 현재 location.state:", location.state);
    
    // URL 파라미터 구성
    const params = new URLSearchParams();
    if (location.state?.area) {
      params.append('area', location.state.area);
    }
    // 세종특별자치시가 아닐 때만 si 파라미터 추가
    if (location.state?.si && location.state.area !== "세종특별자치시") {
      params.append('si', location.state.si);
    }
    if (location.state?.categories?.length > 0) {
      // 첫 번째 카테고리만 사용 (다중 카테고리는 프론트에서 처리)
      params.append('category', location.state.categories[0]);
    }
    params.append('usable', 'true'); // 사용 가능한 매장만
    
    const url = `http://localhost:5000/stores${params.toString() ? `?${params.toString()}` : ''}`;
    console.log("API 요청 URL:", url);
    
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log(`매장 데이터 로드 성공: ${data.length}개`);
        setStores(data);
      })
      .catch((error) => {
        console.error("매장 데이터 로드 실패:", error);
        alert("서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.");
        setStores([]); // 빈 배열로 설정
      });
  }, [location]);

  // 필터링된 매장 (간소화 - 백엔드에서 대부분 처리됨)
  const filteredStores = useMemo(() => {
    if (stores.length === 0) {
      return [];
    }
    
    // 검색어 필터링만 프론트엔드에서 처리 (백엔드에서 이미 지역/카테고리 필터링됨)
    if (!searchTerm) {
      return stores;
    }
    
    return stores.filter((store) => 
      store.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stores, searchTerm]);

  // 선택된 매장이 있을 때만 지도 중심 이동 (선택 해제 시에는 현재 위치 유지)
  useEffect(() => {
    if (selectedStore) {
      setCenter({ lat: selectedStore.lat, lng: selectedStore.lng });
    }
    // selectedStore가 null이 될 때는 지도 위치를 변경하지 않아서
    // 사용자가 보던 위치 그대로 유지됨
  }, [selectedStore]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentState={location.state} />
      <div className="flex flex-1" style={{ height: "calc(100vh - 64px)" }}>
        {/* 왼쪽 사이드바 */}
        <div className="w-[350px] bg-white shadow-lg z-20 flex flex-col h-full">
          {/* 사이드바 헤더 */}
          <div className="p-4 border-b bg-gray-50 flex-shrink-0">
            <h3 className="font-semibold text-lg text-gray-800">매장 목록</h3>
            <p className="text-sm text-gray-600 mt-1">
              {filteredStores.length > 0 ? `${filteredStores.length}개 매장` : '매장을 로딩 중...'}
            </p>
            <div className="mt-3">
          <DirectionsBox onSearch={setSearchTerm} stores={stores} />
            </div>
          </div>
          
          {/* 스크롤 가능한 매장 목록 */}
          <div 
            className="flex-1 overflow-y-scroll" 
            style={{ 
              maxHeight: 'calc(100vh - 170px)',
              scrollbarWidth: 'thin',
              scrollbarColor: '#9ca3af #e5e7eb'
            }}
          >
            {filteredStores.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-4">🏪</div>
                <p>해당 조건에 맞는 매장이 없습니다.</p>
              </div>
            ) : (
              filteredStores.map((store, index) => {
                const isAvailable = store.available || store.usable_with_fund || store.accepts_paper || store.accepts_mobile;
                const paymentMethods = [];
                if (store.usable_with_fund) paymentMethods.push("충전식 카드");
                if (store.accepts_paper) paymentMethods.push("지류");
                if (store.accepts_mobile) paymentMethods.push("모바일");
                
                return (
                  <div 
                    key={store._id || index}
                    className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedStore(store);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {store.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {store.address}
                        </p>
                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            isAvailable 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {isAvailable ? '✅ 사용가능' : '❌ 사용불가'}
                          </span>
                          {store.category && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                              {store.category}
                            </span>
                          )}
                        </div>
                        {paymentMethods.length > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            💳 {paymentMethods.join(", ")}
                          </p>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // 부모 onClick 이벤트 방지
                            if (window.showDirections) {
                              window.showDirections(store.lat, store.lng);
                            } else {
                              alert("지도가 로드 중입니다. 잠시 후 다시 시도해주세요.");
                            }
                          }}
                          className="mt-2 inline-flex items-center px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                        >
                          길찾기
                        </button>
                      </div>
                      <div className={`w-3 h-3 rounded-full ml-3 mt-1 flex-shrink-0 ${
                        isAvailable ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                </div>
                );
              })
            )}
          </div>
        </div>

        {/* 지도 영역 */}
        <div className="flex-1 relative bg-gray-100">
            <NaverMap
            stores={filteredStores.length > 0 ? filteredStores : stores}
              center={center}
              selected={selectedStore}
            onMapLoad={setMapInstance}
            onClearSelection={() => setSelectedStore(null)}
            />
        </div>
      </div>
    </div>
  );
}

export default Tab2MapPage;
