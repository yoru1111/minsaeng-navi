import { useEffect, useRef, useState } from "react"; // useRef 추가

function NaverMap({ stores, center, selected, onMapLoad }) { // onMapLoad 프롭 추가
  const mapRef = useRef(null); // 지도 객체를 저장할 ref
  const [directions, setDirections] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // 사용자 위치 가져오기
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("위치 정보를 가져올 수 없습니다:", error);
        }
      );
    }
  };

  // 길찾기 기능
  const showDirections = (destination) => {
    if (!userLocation) {
      alert("현재 위치를 먼저 설정해주세요.");
      getUserLocation();
      return;
    }

    if (directions) {
      directions.setMap(null); // 기존 경로 제거
    }

    const directionsService = new window.naver.maps.DirectionsService();
    const directionsRenderer = new window.naver.maps.DirectionsRenderer({
      map: mapRef.current,
      suppressMarkers: true // 기본 마커 숨기기
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
      } else {
        alert("경로를 찾을 수 없습니다.");
      }
    });
  };

  // 경로 초기화
  const clearDirections = () => {
    if (directions) {
      directions.setMap(null);
      setDirections(null);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=01dip867u8&submodules=directions";

    script.async = true;
    script.onload = () => {
      const map = new window.naver.maps.Map("map", {
        center: new window.naver.maps.LatLng(center.lat, center.lng),
        zoom: 14,
        draggable: true, // 드래그 가능
        zoomable: true,  // 확대/축소 가능
        pinchZoom: true, // 핀치 줌 가능
        scrollWheel: true, // 마우스 휠로 확대/축소 가능
      });
      mapRef.current = map; // map 객체를 ref에 저장

      if (onMapLoad) {
        onMapLoad(map); // 부모 컴포넌트로 map 객체 전달
      }

      const markers = [];

      stores.forEach((store) => {
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(store.lat, store.lng),
          map,
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
                <div 
                  onclick="window.showDirections(${store.lat}, ${store.lng})" 
                  style="
                    width: 14px;
                    height: 14px;
                    background: ${store.available ? "green" : "gray"};
                    border-radius: 50%;
                    border: 2px solid white;
                    pointer-events: auto;
                    cursor: pointer;
                  ">
                </div>
              </div>
            `,
            size: new window.naver.maps.Size(40, 40),
            anchor: new window.naver.maps.Point(20, 40),
          },
        });

        const infoWindow = new window.naver.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 4px;">${store.name}</div>
              <button onclick="window.showDirections(${store.lat}, ${store.lng})" 
                      style="background: #007bff; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; margin-right: 4px;">
                길찾기
              </button>
              <button onclick="window.clearDirections()" 
                      style="background: #6c757d; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">
                경로 지우기
              </button>
            </div>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });

        markers.push({ marker, store });
      });

      // 클릭된 매장에 지도 중심 이동
      if (selected) {
        const target = markers.find((m) => m.store.id === selected.id);
        if (target) {
          map.setCenter(target.marker.getPosition());
        }
      }

      // 전역 함수로 등록
      window.showDirections = (lat, lng) => {
        showDirections({ lat, lng });
      };
      window.clearDirections = clearDirections;
    };
    document.head.appendChild(script);

    return () => { // 컴포넌트 언마운트 시 스크립트 제거 (선택 사항)
      // document.head.removeChild(script);
      // map 인스턴스 정리 (필요하다면)
    };
  }, [stores, center, selected, onMapLoad]); // onMapLoad를 의존성 배열에 추가

  return (
    <div className="relative w-full h-full">
      <div id="map" className="w-full h-full" style={{ height: "100vh", minHeight: "600px" }}></div>
      <div className="absolute top-4 left-4 z-10 bg-white p-2 rounded shadow">
        <button 
          onClick={getUserLocation}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm mr-2"
        >
          내 위치 설정
        </button>
        <button 
          onClick={clearDirections}
          className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
        >
          경로 지우기
        </button>
      </div>
    </div>
  );
}

export default NaverMap;