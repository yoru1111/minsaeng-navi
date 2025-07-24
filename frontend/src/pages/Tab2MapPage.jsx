import { useState, useEffect } from "react";
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

  const regionCenterMap = {
    "서울": { lat: 37.5665, lng: 126.9780 },
    "부산": { lat: 35.1796, lng: 129.0756 },
    "대구": { lat: 35.8714, lng: 128.6014 },
    "인천": { lat: 37.4563, lng: 126.7052 },
    "광주": { lat: 35.1595, lng: 126.8526 },
    "대전": { lat: 36.3504, lng: 127.3845 },
    "울산": { lat: 35.5384, lng: 129.3114 },
    "세종": { lat: 36.4801, lng: 127.289 },
    "경기도": { lat: 37.4138, lng: 127.5183 },
    "강원도": { lat: 37.8228, lng: 128.1555 },
    "충청북도": { lat: 36.8, lng: 127.7 },
    "충청남도": { lat: 36.4, lng: 126.8 },
    "전라북도": { lat: 35.8, lng: 127.1 },
    "전라남도": { lat: 34.8, lng: 126.5 },
    "경상북도": { lat: 36.5, lng: 128.7 },
    "경상남도": { lat: 35.3, lng: 128.3 },
  };

  // 초기: 도 단위 중심 설정 테스트
  useEffect(() => {
    if (location.state?.area) {
      const region = location.state.area;
      setCenter(regionCenterMap[region] || center);
    }
  }, [location.state]);

  // 매장 데이터 로드
  useEffect(() => {
    fetch("/stores.json")
      .then((res) => res.json())
      .then((data) => setStores(data))
      .catch(console.error);
  }, []);

  // 필터링된 매장
  const filteredStores = stores.filter((store) => {
    const { area, si, categories } = location.state || {};
    const inRegion = store.address?.includes(area) && store.address?.includes(si);
    const inCategory = categories?.includes(store.category);
    const nameMatch = store.name.toLowerCase().includes(searchTerm.toLowerCase());
    return inRegion && inCategory && nameMatch;
  });

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
                  <a
                    href={`https://map.naver.com/v5/directions?c=15.00,0,0,0,dh&destination=${store.lng},${store.lat},${store.name},PLACE`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block px-3 py-1 bg-blue-500 text-white text-sm rounded"
                  >
                    안내받기
                  </a>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 지도 */}
        <div className="flex-1 relative bg-gray-100">
          <div className="absolute top-4 right-4 z-10">
            <MapControls />
          </div>
          <div className="w-full h-full">
            <NaverMap
              stores={filteredStores}
              center={center}
              selected={selectedStore}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tab2MapPage;
