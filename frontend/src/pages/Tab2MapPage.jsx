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

  // 지도 중심 설정
  useEffect(() => {
    if (location.state?.area) {
      const region = location.state.area;
      const regionCenterMap = {
        "서울": { lat: 37.5665, lng: 126.9780 },
        "부산": { lat: 35.1796, lng: 129.0756 },
        "대구": { lat: 35.8714, lng: 128.6014 },
        "경기도": { lat: 37.4138, lng: 127.5183 },
      };
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
    const nameMatch = store.name?.includes(searchTerm);

    return inRegion && inCategory && nameMatch;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        {/* 왼쪽 사이드바 */}
        <div className="w-[300px] bg-white shadow px-4 py-6 overflow-y-auto">
          <DirectionsBox onSearch={setSearchTerm} stores={stores} />
          <div className="mt-6 space-y-4">
            {filteredStores.map((store) => (
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
            ))}
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
