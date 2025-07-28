import { useEffect, useRef, useState, useCallback } from "react";

<<<<<<< HEAD
function NaverMap({ stores, center, selected, onMapLoad }) {
=======
function NaverMap({ stores, center, selected, onMapLoad, onMapCenterChange }) {
>>>>>>> sub3
  const mapRef = useRef(null);
  const [directions, setDirections] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [map, setMap] = useState(null);
<<<<<<< HEAD
  const [markers, setMarkers] = useState([]);
  const [infoWindows, setInfoWindows] = useState([]);
=======
  const [markers] = useState([]);
  const shouldUpdateByUser = useRef(true);

  const onZoomIn = () => {
    if (map) {
      map.setZoom(map.getZoom() + 1);
    }
  };

  const onZoomOut = () => {
    if (map) {
      map.setZoom(map.getZoom() - 1);
    }
  };
  
  const onCenter = () => {
    if (map) {
      map.setCenter(new window.naver.maps.LatLng(center.lat, center.lng));
    }
  };
>>>>>>> sub3

  // 사용자 위치 가져오기
  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          
          // 지도에 사용자 위치 마커 추가
          if (map) {
            new window.naver.maps.Marker({
              position: new window.naver.maps.LatLng(location.lat, location.lng),
              map: map,
              icon: {
                content: `
                  <div style="
                    width: 20px;
                    height: 20px;
                    background: #4285f4;
                    border: 3px solid white;
                    border-radius: 50%;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                  ">
                  </div>
                `,
                size: new window.naver.maps.Size(20, 20),
                anchor: new window.naver.maps.Point(10, 10),
              },
            });
          }
        },
        (error) => {
          console.error("위치 정보를 가져올 수 없습니다:", error);
          alert("위치 정보를 가져올 수 없습니다. 브라우저 설정을 확인해주세요.");
        }
      );
    } else {
      alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
    }
  }, [map]);

  // 길찾기 기능
  const showDirections = useCallback((destination) => {
    if (!userLocation) {
      alert("현재 위치를 먼저 설정해주세요.");
      getUserLocation();
      return;
    }

    if (directions) {
      directions.setMap(null);
    }

    const directionsService = new window.naver.maps.DirectionsService();
    const directionsRenderer = new window.naver.maps.DirectionsRenderer({
      map: map,
      suppressMarkers: true
    });

    directionsService.route({
      origin: new window.naver.maps.LatLng(userLocation.lat, userLocation.lng),
      destination: new window.naver.maps.LatLng(destination.lat, destination.lng),
      waypoints: [],
      optimizeWaypoints: true,
      avoidTolls: false,
      avoidHighways: false,
    }, (result, status) => {
      if (status === window.naver.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result);
        setDirections(directionsRenderer);
        
        // 경로 정보 표시
        const route = result.routes[0];
        const leg = route.legs[0];
        console.log(`총 거리: ${leg.distance.text}, 예상 시간: ${leg.duration.text}`);
        
        // 경로 정보를 화면에 표시
        const routeInfo = document.createElement('div');
        routeInfo.innerHTML = `
          <div style="
            position: absolute;
            top: 80px;
            left: 10px;
            background: white;
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
            font-size: 14px;
          ">
            <div><strong>총 거리:</strong> ${leg.distance.text}</div>
            <div><strong>예상 시간:</strong> ${leg.duration.text}</div>
            <button onclick="this.parentElement.remove()" style="
              background: #dc3545;
              color: white;
              border: none;
              padding: 4px 8px;
              border-radius: 4px;
              cursor: pointer;
              margin-top: 5px;
            ">닫기</button>
          </div>
        `;
        document.getElementById('map').appendChild(routeInfo);
      } else {
        alert("경로를 찾을 수 없습니다.");
      }
    });
  }, [map, userLocation, directions, getUserLocation]);

  // 경로 초기화
  const clearDirections = useCallback(() => {
    if (directions) {
      directions.setMap(null);
      setDirections(null);
    }
    // 경로 정보 창들 제거
    const routeInfos = document.querySelectorAll('#map > div[style*="position: absolute"]');
    routeInfos.forEach(info => info.remove());
  }, [directions]);

  // 마커 생성
<<<<<<< HEAD
  const createMarkers = useCallback(() => {
    if (!map) return;

    // 기존 마커들 제거
    markers.forEach(({ marker }) => marker.setMap(null));
    infoWindows.forEach(infoWindow => infoWindow.close());

    const newMarkers = [];
    const newInfoWindows = [];

    stores.forEach((store) => {
      // 사용 가능 여부에 따른 마커 색상 결정
      const isAvailable = store.available || store.usable_with_fund || store.accepts_paper || store.accepts_mobile;
      const markerColor = isAvailable ? "#28a745" : "#6c757d"; // 사용가능: 초록, 불가능: 회색
      
      // 마커 생성
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(store.lat, store.lng),
        map: map,
        icon: {
          content: `
            <div style="
              display: flex;
              flex-direction: column;
              align-items: center;
              transform: translate(-50%, -100%);
              pointer-events: none;
              z-index: 1;
            ">
              <div style="
                font-size: 12px;
                background: white;
                border: 1px solid #ccc;
                padding: 2px 6px;
                border-radius: 4px;
                white-space: nowrap;
                margin-bottom: 4px;
                box-shadow: 0 1px 4px rgba(0,0,0,0.1);
                pointer-events: none;
              ">
                ${store.name}
              </div>
              <div style="
                width: 16px;
                height: 16px;
                background: ${markerColor};
                border-radius: 50%;
                border: 2px solid white;
                pointer-events: auto;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              ">
              </div>
            </div>
          `,
          size: new window.naver.maps.Size(40, 40),
          anchor: new window.naver.maps.Point(20, 40),
        },
      });

      // 취급 여부 정보 생성
      const paymentMethods = [];
      if (store.usable_with_fund) paymentMethods.push("충전식 카드");
      if (store.accepts_paper) paymentMethods.push("지류");
      if (store.accepts_mobile) paymentMethods.push("모바일");
      
      const paymentText = paymentMethods.length > 0 
        ? paymentMethods.join(", ") 
        : "취급하지 않음";
      
      // 정보창 생성
      const infoWindow = new window.naver.maps.InfoWindow({
        content: `
          <div style="padding: 12px; min-width: 250px;">
            <div style="font-weight: bold; font-size: 16px; margin-bottom: 8px; color: #333;">
              ${store.name}
            </div>
            <div style="font-size: 14px; color: #666; margin-bottom: 8px;">
              ${store.address}
            </div>
            <div style="font-size: 12px; color: #888; margin-bottom: 8px;">
              카테고리: ${store.category}
            </div>
            <div style="font-size: 12px; color: ${isAvailable ? '#28a745' : '#dc3545'}; margin-bottom: 12px; font-weight: bold;">
              💳 결제 수단: ${paymentText}
            </div>
            <div style="display: flex; gap: 8px;">
              <button onclick="window.showDirections(${store.lat}, ${store.lng})" 
                      style="
                        background: #007bff; 
                        color: white; 
                        border: none; 
                        padding: 6px 12px; 
                        border-radius: 4px; 
                        cursor: pointer;
                        font-size: 12px;
                      ">
                🚗 길찾기
              </button>
              <button onclick="window.clearDirections()" 
                      style="
                        background: #6c757d; 
                        color: white; 
                        border: none; 
                        padding: 6px 12px; 
                        border-radius: 4px; 
                        cursor: pointer;
                        font-size: 12px;
                      ">
                🗑️ 경로 지우기
              </button>
            </div>
          </div>
        `,
      });

      // 마커 클릭 이벤트
      window.naver.maps.Event.addListener(marker, 'click', () => {
        infoWindow.open(map, marker);
      });

      newMarkers.push({ marker, store });
      newInfoWindows.push(infoWindow);
    });

    setMarkers(newMarkers);
    setInfoWindows(newInfoWindows);
  }, [map, markers, infoWindows, stores]);

=======
  const markersRef = useRef([]);
const infoWindowsRef = useRef([]);

const createMarkers = useCallback(() => {
  if (!map || !Array.isArray(stores)) return;

  console.log("📌 마커 생성 시작");
  console.log("📍 매장 개수:", stores.length);

  if (stores.length === 0) {
    console.warn("⚠️ 표시할 매장이 없습니다.");
    return;
  }

  // 기존 마커 제거
  markersRef.current.forEach(({ marker }) => marker.setMap(null));
  infoWindowsRef.current.forEach(info => info.close());
  markersRef.current = [];
  infoWindowsRef.current = [];

  const newMarkers = [];
  const newInfoWindows = [];

  stores.forEach((store, idx) => {
    console.log(`🧭 [${idx}] 매장 정보:`, store);

    // 좌표 유효성 검사
    if (typeof store.lat !== "number" || typeof store.lng !== "number") {
      console.warn(`❌ [${idx}] 잘못된 좌표:`, store.lat, store.lng);
      return;
    }

    // 사용 가능 여부 판단
    const isAvailable = store.available || store.usable_with_fund || store.accepts_paper || store.accepts_mobile;
    const markerColor = isAvailable ? "#28a745" : "#6c757d";

    // 마커 생성
    const marker = new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(store.lat, store.lng),
      map: map,
      icon: {
        content: `
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            transform: translate(-50%, -100%);
            pointer-events: none;
            z-index: 1;
          ">
            <div style="
              font-size: 12px;
              background: white;
              border: 1px solid #ccc;
              padding: 2px 6px;
              border-radius: 4px;
              white-space: nowrap;
              margin-bottom: 4px;
              box-shadow: 0 1px 4px rgba(0,0,0,0.1);
              pointer-events: none;
            ">
              ${store.name}
            </div>
            <div style="
              width: 16px;
              height: 16px;
              background: ${markerColor};
              border-radius: 50%;
              border: 2px solid white;
              pointer-events: auto;
              cursor: pointer;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            "></div>
          </div>
        `,
        size: new window.naver.maps.Size(40, 40),
        anchor: new window.naver.maps.Point(20, 40),
      },
    });

    // 결제 수단 정보 구성
    const paymentMethods = [];
    if (store.usable_with_fund) paymentMethods.push("충전식 카드");
    if (store.accepts_paper) paymentMethods.push("지류");
    if (store.accepts_mobile) paymentMethods.push("모바일");

    const paymentText = paymentMethods.length > 0
      ? paymentMethods.join(", ")
      : "취급하지 않음";

    // 정보창 생성
    const infoWindow = new window.naver.maps.InfoWindow({
      content: `
        <div style="padding: 12px; min-width: 250px;">
          <div style="font-weight: bold; font-size: 16px; margin-bottom: 8px; color: #333;">
            ${store.name}
          </div>
          <div style="font-size: 14px; color: #666; margin-bottom: 8px;">
            ${store.address}
          </div>
          <div style="font-size: 12px; color: #888; margin-bottom: 8px;">
            카테고리: ${store.category}
          </div>
          <div style="font-size: 12px; color: ${isAvailable ? '#28a745' : '#dc3545'}; margin-bottom: 12px; font-weight: bold;">
            💳 결제 수단: ${paymentText}
          </div>
        </div>
      `,
    });


    // 마커 클릭 이벤트 등록
    window.naver.maps.Event.addListener(marker, "click", () => {
      infoWindow.open(map, marker);
    });

    newMarkers.push({ marker, store });
    newInfoWindows.push(infoWindow);
  });

  // 마커 및 정보창 refs에 저장 (setState 대신)
  markersRef.current = newMarkers;
  infoWindowsRef.current = newInfoWindows;

  console.log(`✅ 마커 ${newMarkers.length}개 생성 완료`);
}, [map, stores]);

  useEffect(() => {
      if (!map) return;

      const listener = window.naver.maps.Event.addListener(map, "center_changed", () => {
        const c = map.getCenter();
        const rounded = {
          lat: Math.round(c.lat() * 10000) / 10000,
          lng: Math.round(c.lng() * 10000) / 10000,
        };

        shouldUpdateByUser.current = true;
        if (typeof onMapCenterChange === "function") {
          onMapCenterChange(rounded);
        }
      });

      return () => {
        window.naver.maps.Event.removeListener(listener);
      };
  }, [map, onMapCenterChange]);

  // 지도 중심이 props.center로 바뀔 때 → 강제로 이동 (드래그에 의해 변경된 경우는 무시)
  useEffect(() => {
    if (!map || !center || !shouldUpdateByUser.current) return;

    map.setCenter(new window.naver.maps.LatLng(center.lat, center.lng));
    shouldUpdateByUser.current = false;
  }, [center, map]);
  
>>>>>>> sub3
  // 네이버 지도 초기화
  useEffect(() => {
    // 인증 실패 처리 함수 등록
    window.navermap_authFailure = () => {
      console.error("네이버 지도 API 인증 실패");
      alert("네이버 지도 API 인증에 실패했습니다. API 키를 확인해주세요.");
    };

    const script = document.createElement("script");
    // Client ID 설정
    const clientId = process.env.REACT_APP_NAVER_CLIENT_ID || "7b1jwmp7eq";
    
<<<<<<< HEAD
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}&submodules=directions,geocoder`;
=======
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}&submodules=directions`;
>>>>>>> sub3

    script.async = true;
    script.onload = () => {
      const naverMap = new window.naver.maps.Map("map", {
        center: new window.naver.maps.LatLng(center.lat, center.lng),
        zoom: 14,
        draggable: true,
        zoomable: true,
        pinchZoom: true,
        scrollWheel: true,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: window.naver.maps.MapTypeControlStyle.DROPDOWN,
          position: window.naver.maps.Position.TOP_RIGHT
        },
        scaleControl: true,
        logoControl: true,
        mapDataControl: true,
        zoomControl: true,
        zoomControlOptions: {
          style: window.naver.maps.ZoomControlStyle.SMALL,
          position: window.naver.maps.Position.TOP_LEFT
        }
      });

      mapRef.current = naverMap;
      setMap(naverMap);

      if (onMapLoad) {
        onMapLoad(naverMap);
      }

      // 전역 함수 등록
      window.showDirections = (lat, lng) => {
        showDirections({ lat, lng });
      };
      window.clearDirections = clearDirections;
    };

    script.onerror = () => {
      console.error("네이버 지도 API 로드 실패");
      alert("지도를 불러올 수 없습니다. 인터넷 연결을 확인해주세요.");
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
<<<<<<< HEAD
  }, []); // 수정한 부분
=======
  }, []);
>>>>>>> sub3

  // 마커 업데이트
  useEffect(() => {
    if (map) {
      createMarkers();
    }
  }, [stores, map, createMarkers]);

<<<<<<< HEAD
  // 선택된 매장에 지도 중심 이동
  useEffect(() => {
  if (selected && map) {
    const target = markers.find((m) => m.store.id === selected.id);
    if (target) {
      map.setCenter(target.marker.getPosition());
      map.setZoom(16);
      const matchedInfoWindow = infoWindows.find((iw, i) => markers[i].store.id === selected.id);
      matchedInfoWindow?.open(map, target.marker);
    }
  }
}, [selected, map, markers, infoWindows]);

  // 중심점 변경 시 지도 이동
  useEffect(() => {
    if (map && center) {
      map.setCenter(new window.naver.maps.LatLng(center.lat, center.lng));
    }
  }, [center, map]);
=======
  // 마커를 bounds 기준으로 필터링해서 관리 (지도 이동 시 업데이트)
  const updateMarkersByBounds = useCallback(() => {
    if (!map) return;

    const bounds = map.getBounds();
    const visibleStores = stores.filter(store => 
      bounds.hasLatLng(new window.naver.maps.LatLng(store.lat, store.lng))
    );

    // 여기서 visibleStores만 createMarkers에 넘기기
    createMarkers(visibleStores);
  }, [map, stores, createMarkers]);

  // 지도 bounds_changed 이벤트 등록
  useEffect(() => {
    if (!map) return;

    const listener = window.naver.maps.Event.addListener(map, "bounds_changed", updateMarkersByBounds);

    return () => window.naver.maps.Event.removeListener(listener);
  }, [map, updateMarkersByBounds]);
>>>>>>> sub3

  return (
    <div className="relative w-full h-full">
      <div id="map" className="w-full h-full" style={{ height: "100vh", minHeight: "600px" }}></div>
<<<<<<< HEAD
      <div className="absolute top-4 left-4 z-10 bg-white p-3 rounded-lg shadow-lg">
        <button 
          onClick={getUserLocation}
          className="bg-blue-500 text-white px-3 py-2 rounded text-sm mr-2 hover:bg-blue-600 transition-colors"
=======
      
      {/* 왼쪽 하단: 위치 및 경로 컨트롤 */}
      <div className="absolute bottom-4 left-4 z-10 bg-white p-3 rounded-lg shadow-lg pointer-events-none">
        <button 
          onClick={getUserLocation}
          className="bg-blue-500 text-white px-3 py-2 rounded text-sm mr-2 hover:bg-blue-600 transition-colors pointer-events-auto"
>>>>>>> sub3
        >
          📍 내 위치 설정
        </button>
        <button 
          onClick={clearDirections}
<<<<<<< HEAD
          className="bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600 transition-colors"
=======
          className="bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600 transition-colors pointer-events-auto"
>>>>>>> sub3
        >
          🗑️ 경로 지우기
        </button>
      </div>
<<<<<<< HEAD
    </div>
  );
}

=======

      {/* 오른쪽 상단: 지도 컨트롤 */}
      <div className="absolute top-14 right-4 z-10 flex flex-col gap-2 pointer-events-none">
        <button 
          className="bg-white px-4 py-2 shadow rounded hover:bg-gray-50 transition-colors pointer-events-auto" 
          onClick={onZoomIn}
        >
          ＋ 확대
        </button>
        <button 
          className="bg-white px-4 py-2 shadow rounded hover:bg-gray-50 transition-colors pointer-events-auto" 
          onClick={onZoomOut}
        >
          － 축소
        </button>
        <button 
          className="bg-white px-4 py-2 shadow rounded hover:bg-gray-50 transition-colors pointer-events-auto" 
          onClick={onCenter}
        >
          📍 현위치
        </button>
      </div>
    </div>
  );
}
// ㅇㅇ
>>>>>>> sub3
export default NaverMap;