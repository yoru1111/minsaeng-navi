import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import DirectionsBox from "../components/DirectionsBox";
import MapControls from "../components/MapControls";
import NaverMap from "../components/NaverMap";

function Tab2MapPage() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.9780 }); // 서울
  const [mapInstance, setMapInstance] = useState(null);

  // 도별 중심 좌표
  const regionCenterMap = {
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
  };

  // 시군구별 중심 좌표 (주요 지역들)
  const siCenterMap = {
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
  };

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
  }, [mapInstance]);

  // 초기: 도 단위 중심 설정
  useEffect(() => {
    if (location.state?.area) {
      const region = location.state.area;
      const si = location.state.si;
      moveToRegion(region, si);
    }
  }, [location.state, moveToRegion]);

  // 매장 데이터 로드
  useEffect(() => {
    fetch("/stores.json")
      .then((res) => res.json())
      .then((data) => setStores(data))
      .catch(console.error);
  }, []);

  // 필터링된 매장 (useMemo로 최적화)
  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      const { area, si, categories } = location.state || {};
      const inRegion = store.address?.includes(area) && store.address?.includes(si);
      const inCategory = categories?.includes(store.category);
      const nameMatch = store.name.toLowerCase().includes(searchTerm.toLowerCase());
      return inRegion && inCategory && nameMatch;
    });
  }, [stores, location.state, searchTerm]);

  // 필터링된 매장이 생겼을 때 → 첫 번째 매장 중심으로 지도 이동
  useEffect(() => {
    if (selectedStore) {
      setCenter({ lat: selectedStore.lat, lng: selectedStore.lng });
    } else if (filteredStores.length > 0) {
      const first = filteredStores[0];
      setCenter({ lat: first.lat, lng: first.lng });
    }
  }, [filteredStores, selectedStore]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        {/* 왼쪽 사이드바 */}
        <div className="w-[300px] bg-white shadow px-4 py-6 overflow-y-auto">
          <DirectionsBox onSearch={setSearchTerm} stores={stores} />
          <div className="mt-6 space-y-4">
            {filteredStores.length === 0 ? (
              <p className="text-gray-500 text-sm text-center">
                해당 조건에 맞는 매장이 없습니다.
              </p>
            ) : (
              filteredStores.map((store) => (
                <div
                  key={store.id}
                  onClick={() => setSelectedStore(store)}
                  className="border p-3 rounded shadow-sm cursor-pointer hover:bg-blue-50"
                >
                  <h2 className="font-bold">{store.name}</h2>
                  <p className="text-sm text-gray-600">{store.address}</p>
                  <button
                    onClick={() => {
                      // 네이버 지도 API 길찾기 기능 사용
                      if (window.showDirections) {
                        window.showDirections(store.lat, store.lng);
                      } else {
                        // 폴백: 네이버 지도 웹사이트로 이동
                        window.open(`https://map.naver.com/v5/directions?c=15.00,0,0,0,dh&destination=${store.lng},${store.lat},${store.name},PLACE`, '_blank');
                      }
                    }}
                    className="mt-2 inline-block px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  >
                    길찾기
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

                 {/* 지도 */}
         <div className="flex-1 relative bg-gray-100" style={{ height: "calc(100vh - 64px)" }}>
           <div className="absolute top-4 right-4 z-10">
             <MapControls />
           </div>
           <div className="w-full h-full">
             <NaverMap
               stores={filteredStores}
               center={center}
               selected={selectedStore}
               onMapLoad={setMapInstance}
             />
           </div>
         </div>
      </div>
    </div>
  );
}

export default Tab2MapPage;
