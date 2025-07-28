import { useEffect, useRef, useState, useCallback } from "react";

function NaverMap({ stores, center, selected, onMapLoad }) {
  const mapRef = useRef(null);
  const [directions, setDirections] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

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
    // GPS를 사용해서 현재 위치로 이동
    getCurrentLocationAndMove();
  };

  // 사용자 위치 상태 추가
  const [userLocationMarker, setUserLocationMarker] = useState(null);
  
  // 이전 위치 저장 (돌아가기 기능용)
  const [previousCenter, setPreviousCenter] = useState(null);

  // 사용자 위치 가져오기 (지도 이동 없이 위치만 설정)
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        
        // 기존 사용자 위치 마커 제거
        if (userLocationMarker) {
          userLocationMarker.setMap(null);
        }
        
        // 지도에 사용자 위치 마커 추가 (지도 이동 없음)
        if (map) {
          const newUserMarker = new window.naver.maps.Marker({
            position: new window.naver.maps.LatLng(location.lat, location.lng),
            map: map,
            icon: {
              content: `
                <div style="
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  transform: translate(-50%, -100%);
                ">
                  <div style="
                    font-size: 11px;
                    background: #4285f4;
                    color: white;
                    padding: 2px 8px;
                    border-radius: 12px;
                    white-space: nowrap;
                    margin-bottom: 4px;
                    box-shadow: 0 2px 8px rgba(66,133,244,0.3);
                    font-weight: bold;
                  ">
                    내 위치
                  </div>
                  <div style="
                    width: 24px;
                    height: 24px;
                    background: #4285f4;
                    border: 4px solid white;
                    border-radius: 50%;
                    box-shadow: 0 3px 12px rgba(66,133,244,0.4);
                    position: relative;
                  ">
                    <div style="
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                      width: 8px;
                      height: 8px;
                      background: white;
                      border-radius: 50%;
                    "></div>
                  </div>
                </div>
              `,
              size: new window.naver.maps.Size(40, 50),
              anchor: new window.naver.maps.Point(20, 50),
            },
            zIndex: 1000
          });
          
          setUserLocationMarker(newUserMarker);
          
          // 위치 설정 완료 알림
          
        }
      },
      (error) => {
        console.error("위치 정보를 가져올 수 없습니다:", error);
        let errorMessage = "위치 정보를 가져올 수 없습니다.";
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "위치 정보 접근이 거부되었습니다.\n브라우저 설정에서 위치 권한을 허용해주세요.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "위치 정보를 사용할 수 없습니다.\nGPS나 네트워크 연결을 확인해주세요.";
            break;
          case error.TIMEOUT:
            errorMessage = "위치 정보 요청이 시간 초과되었습니다.\n다시 시도해주세요.";
            break;
        }
        
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true, // 높은 정확도 사용
        timeout: 10000,          // 10초 타임아웃
        maximumAge: 60000        // 1분간 캐시된 위치 사용
      }
    );
  }, [map, userLocationMarker]);

  // 현재 위치로 지도 이동 (현위치 버튼용)
  const getCurrentLocationAndMove = useCallback(() => {
    if (!navigator.geolocation) {
      alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        
        // 기존 사용자 위치 마커 제거
        if (userLocationMarker) {
          userLocationMarker.setMap(null);
        }
        
        // 지도에 사용자 위치 마커 추가
        if (map) {
          // ⭐ 현재 지도 중심점을 이전 위치로 저장 (돌아가기용)
          const currentCenter = map.getCenter();
          setPreviousCenter({
            lat: currentCenter.lat(),
            lng: currentCenter.lng(),
            zoom: map.getZoom()
          });

          const newUserMarker = new window.naver.maps.Marker({
            position: new window.naver.maps.LatLng(location.lat, location.lng),
            map: map,
          icon: {
            content: `
              <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                transform: translate(-50%, -100%);
              ">
                <div style="
                    font-size: 11px;
                    background: #4285f4;
                    color: white;
                    padding: 2px 8px;
                    border-radius: 12px;
                  white-space: nowrap;
                  margin-bottom: 4px;
                    box-shadow: 0 2px 8px rgba(66,133,244,0.3);
                    font-weight: bold;
                ">
                    내 위치
                </div>
                  <div style="
                    width: 24px;
                    height: 24px;
                    background: #4285f4;
                    border: 4px solid white;
                    border-radius: 50%;
                    box-shadow: 0 3px 12px rgba(66,133,244,0.4);
                    position: relative;
                  ">
                    <div style="
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                      width: 8px;
                      height: 8px;
                      background: white;
                      border-radius: 50%;
                    "></div>
                  </div>
              </div>
            `,
              size: new window.naver.maps.Size(40, 50),
              anchor: new window.naver.maps.Point(20, 50),
            },
            zIndex: 1000
          });
          
          setUserLocationMarker(newUserMarker);
          
          // ⭐ 지도를 사용자 위치로 이동 (현위치 버튼의 핵심 기능)
          map.setCenter(new window.naver.maps.LatLng(location.lat, location.lng));
          map.setZoom(16); // 적당한 확대 레벨
        }
      },
      (error) => {
        console.error("위치 정보를 가져올 수 없습니다:", error);
        let errorMessage = "위치 정보를 가져올 수 없습니다.";
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "위치 정보 접근이 거부되었습니다.\n브라우저 설정에서 위치 권한을 허용해주세요.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "위치 정보를 사용할 수 없습니다.\nGPS나 네트워크 연결을 확인해주세요.";
            break;
          case error.TIMEOUT:
            errorMessage = "위치 정보 요청이 시간 초과되었습니다.\n다시 시도해주세요.";
            break;
        }
        
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true, // 높은 정확도 사용
        timeout: 10000,          // 10초 타임아웃
        maximumAge: 60000        // 1분간 캐시된 위치 사용
             }
     );
   }, [map, userLocationMarker]);

   // 이전 위치로 돌아가기 기능
   const goBackToPreviousLocation = useCallback(() => {
     if (!previousCenter || !map) {
       alert("돌아갈 이전 위치가 없습니다.");
       return;
     }

     // 이전 위치로 지도 이동
     map.setCenter(new window.naver.maps.LatLng(previousCenter.lat, previousCenter.lng));
     map.setZoom(previousCenter.zoom || 14);
     
     // 이전 위치 정보 초기화
     setPreviousCenter(null);
   }, [map, previousCenter]);

   // 길찾기 기능 (개선된 버전 - 네이버 Directions API 사용)
  const showDirections = useCallback(async (destination) => {
    if (!userLocation) {
      alert("현재 위치를 먼저 설정해주세요.");
      getUserLocation();
      return;
    }

    // 기존 경로 제거
    if (directions) {
      directions.setMap(null);
    }

    try {
      // 백엔드 프록시를 통한 네이버 Directions API 호출
      const response = await fetch(`http://localhost:5000/api/directions?start=${userLocation.lng},${userLocation.lat}&goal=${destination.lng},${destination.lat}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '길찾기 API 호출 실패');
      }

      const data = await response.json();
      
      if (data.code === 0 && data.route && data.route.traoptimal && data.route.traoptimal.length > 0) {
        const route = data.route.traoptimal[0];
        const path = route.path;
        
        // 경로를 지도에 표시
        const polylinePath = [];
        for (let i = 0; i < path.length; i += 2) {
          polylinePath.push(new window.naver.maps.LatLng(path[i + 1], path[i]));
        }

        const polyline = new window.naver.maps.Polyline({
          map: map,
          path: polylinePath,
          strokeColor: '#5347AA',
          strokeWeight: 6,
          strokeOpacity: 0.8
        });

        setDirections(polyline);

        // 시작점과 도착점을 포함하는 영역으로 지도 범위 조정
        const bounds = new window.naver.maps.LatLngBounds(
          new window.naver.maps.LatLng(userLocation.lat, userLocation.lng),
          new window.naver.maps.LatLng(destination.lat, destination.lng)
        );
        
        // 경로의 모든 점을 포함하도록 bounds 확장
        polylinePath.forEach(point => bounds.extend(point));
        
        // 지도 범위 조정 (패딩 추가)
        map.fitBounds(bounds, {
          top: 50,
          right: 50,
          bottom: 100,
          left: 50
        });

        // 경로 정보 표시
        const distance = (route.summary.distance / 1000).toFixed(1); // km 단위
        const duration = Math.round(route.summary.duration / 1000 / 60); // 분 단위
        
        // 기존 경로 정보 창 제거
        const existingInfo = document.querySelector('#route-info');
        if (existingInfo) {
          existingInfo.remove();
        }

        const routeInfo = document.createElement('div');
        routeInfo.id = 'route-info';
        routeInfo.innerHTML = `
          <div style="
            position: absolute;
            top: 80px;
            left: 10px;
            background: white;
            padding: 15px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 1000;
            font-size: 14px;
            min-width: 200px;
          ">
            <div style="font-weight: bold; color: #5347AA; margin-bottom: 8px;">🚗 길찾기 결과</div>
            <div style="margin-bottom: 5px;"><strong>총 거리:</strong> ${distance}km</div>
            <div style="margin-bottom: 10px;"><strong>예상 시간:</strong> ${duration}분</div>
            <button onclick="this.parentElement.remove()" style="
              background: #dc3545;
              color: white;
              border: none;
              padding: 6px 12px;
              border-radius: 6px;
              cursor: pointer;
              font-size: 12px;
              width: 100%;
            ">경로 닫기</button>
          </div>
        `;
        document.getElementById('map').appendChild(routeInfo);

      } else {
        throw new Error('경로 데이터가 없습니다');
      }

    } catch (error) {
      console.error('길찾기 오류:', error);
      
      // 네이버 Directions API가 실패하면 간단한 직선 경로 표시
      const polyline = new window.naver.maps.Polyline({
        map: map,
        path: [
          new window.naver.maps.LatLng(userLocation.lat, userLocation.lng),
          new window.naver.maps.LatLng(destination.lat, destination.lng)
        ],
        strokeColor: '#ff0000',
        strokeWeight: 4,
        strokeOpacity: 0.6,
        strokeStyle: [10, 5] // 점선
      });

      setDirections(polyline);

      // 시작점과 도착점을 모두 보이게 지도 조정
      const bounds = new window.naver.maps.LatLngBounds(
        new window.naver.maps.LatLng(userLocation.lat, userLocation.lng),
        new window.naver.maps.LatLng(destination.lat, destination.lng)
      );
      
      map.fitBounds(bounds, {
        top: 50,
        right: 50,
        bottom: 100,
        left: 50
      });

      alert("상세 경로를 찾을 수 없어 직선 거리로 표시합니다.");
    }
  }, [map, userLocation, directions, getUserLocation]);

  // 경로 초기화 (개선된 버전)
  const clearDirections = useCallback(() => {
    if (directions) {
      directions.setMap(null);
      setDirections(null);
    }
    
    // 경로 정보 창 제거
    const routeInfo = document.querySelector('#route-info');
    if (routeInfo) {
      routeInfo.remove();
    }
    
    // 기타 경로 관련 정보 창들 제거
    const routeInfos = document.querySelectorAll('#map > div[style*="position: absolute"]');
    routeInfos.forEach(info => info.remove());
  }, [directions]);

  // 마커 생성 (성능 최적화)
  const createMarkers = useCallback(() => {
    if (!map || !stores || stores.length === 0) return;

    console.time('마커 생성 시간');

    // 기존 마커들 제거 (배치 처리)
    setMarkers(prevMarkers => {
      if (prevMarkers.length > 0) {
        console.log(`기존 마커 ${prevMarkers.length}개 제거 중...`);
        prevMarkers.forEach(({ marker }) => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
      }
      return [];
    });

    const newMarkers = [];
    const validStores = stores.filter(store => 
      store.lat && store.lng && !isNaN(store.lat) && !isNaN(store.lng)
    );

    console.log(`유효한 매장 ${validStores.length}개 마커 생성 중...`);

    // 모든 유효한 매장에 대해 마커 생성
    const processedStores = validStores;

    processedStores.forEach((store) => {
      // 사용 가능 여부에 따른 마커 색상 결정
      const isAvailable = store.available || store.usable_with_fund || store.accepts_paper || store.accepts_mobile;
      const markerColor = isAvailable ? "#28a745" : "#6c757d";
      
      // 심플한 마커 생성 (초기에는 지도에 추가하지 않음)
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(store.lat, store.lng),
        map: null, // 초기에는 숨김
        icon: {
          content: `
            <div style="
              width: 14px;
              height: 14px;
              background: ${markerColor};
              border-radius: 50%;
              border: 2px solid white;
              cursor: pointer;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              transform: translate(-50%, -50%);
            "></div>
          `,
          size: new window.naver.maps.Size(18, 18),
          anchor: new window.naver.maps.Point(9, 9),
        },
      });

      // 취급 여부 정보 생성 (지연 로딩)
      const createInfoWindow = () => {
        const paymentMethods = [];
        if (store.usable_with_fund) paymentMethods.push("충전식 카드");
        if (store.accepts_paper) paymentMethods.push("지류");
        if (store.accepts_mobile) paymentMethods.push("모바일");
        
        const paymentText = paymentMethods.length > 0 
          ? paymentMethods.join(", ") 
          : "취급하지 않음";
        
        return new window.naver.maps.InfoWindow({
          content: `
            <div style="padding: 12px; min-width: 200px;">
              <div style="font-weight: bold; font-size: 14px; margin-bottom: 6px;">
                ${store.name}
              </div>
              <div style="font-size: 12px; color: #666; margin-bottom: 6px;">
                ${store.address}
              </div>
              <div style="font-size: 11px; color: ${isAvailable ? '#28a745' : '#dc3545'}; margin-bottom: 8px;">
                💳 ${paymentText}
              </div>
              <button onclick="window.showDirections(${store.lat}, ${store.lng})" 
                      style="background: #007bff; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 11px;">
                길찾기
              </button>
            </div>
          `,
        });
      };

      // 마커 클릭 이벤트 (정보창은 지연 생성)
      let infoWindow = null;
      window.naver.maps.Event.addListener(marker, 'click', () => {
        if (!infoWindow) {
          infoWindow = createInfoWindow();
        }
        infoWindow.open(map, marker);
      });

      newMarkers.push({ marker, store });
    });

    console.log(`마커 ${newMarkers.length}개 생성 완료`);
    setMarkers(newMarkers);
    
    console.timeEnd('마커 생성 시간');
    
    // 초기 마커 업데이트 수행 (다음 프레임에서)
    requestAnimationFrame(() => {
      updateMarkers(map, newMarkers);
    });
  }, [map, stores]);

  // 마커 표시/숨김 최적화 함수들
  const showMarker = useCallback((map, marker) => {
    // 지도에 표시되어있는지 확인
    if (marker.getMap()) return;
    // 표시되어있지 않다면 오버레이를 지도에 추가
    marker.setMap(map);
  }, []);

  const hideMarker = useCallback((marker) => {
    // 지도에 표시되어있는지 확인
    if (!marker.getMap()) return;
    // 표시되어있다면 오버레이를 지도에서 삭제
    marker.setMap(null);
  }, []);

  const updateMarkers = useCallback((map, markersArray) => {
    if (!map || !markersArray) return;
    
    // 현재 지도의 화면 영역을 mapBounds 변수에 저장
    const mapBounds = map.getBounds();
    
    // 마커 객체 배열을 순회하며 각 마커의 위치를 확인
    markersArray.forEach(({ marker }) => {
      const position = marker.getPosition();
      
      // mapBounds와 비교하며 마커가 현재 화면에 보이는 영역에 있는지 확인
      if (mapBounds.hasPoint(position)) {
        // 보이는 영역에 있다면 마커 표시
        showMarker(map, marker);
      } else {
        // 숨겨진 영역에 있다면 마커 숨김
        hideMarker(marker);
      }
    });
  }, [showMarker, hideMarker]);

  // 지도 이동 이벤트 핸들러
  const idleHandler = useCallback(() => {
    updateMarkers(map, markers);
  }, [map, markers, updateMarkers]);

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
    
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}&submodules=directions`;

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
  }, []);

  // 마커 업데이트
  useEffect(() => {
    if (map) {
      createMarkers();
    }
  }, [createMarkers, map]);

  // 지도 이동 이벤트 등록 (성능 최적화)
  useEffect(() => {
    if (map) {
      const moveEventListener = window.naver.maps.Event.addListener(
        map,
        'idle',
        idleHandler
      );
      
      return () => {
        window.naver.maps.Event.removeListener(moveEventListener);
      };
    }
  }, [map, idleHandler]);

  // 선택된 매장에 지도 중심 이동
  useEffect(() => {
    if (selected && map) {
      const target = markers.find((m) => m.store.id === selected.id);
      if (target) {
        map.setCenter(target.marker.getPosition());
        map.setZoom(16);
      }
    }
  }, [selected, map, markers]);

  // 중심점 변경 시 지도 이동
  useEffect(() => {
    if (map && center) {
      map.setCenter(new window.naver.maps.LatLng(center.lat, center.lng));
    }
  }, [center, map]);

  return (
    <div className="relative w-full h-full">
      <div id="map" className="w-full h-full" style={{ height: "100vh", minHeight: "600px" }}></div>
      
      {/* 왼쪽 하단: 위치 및 경로 컨트롤 */}
      <div className="absolute bottom-4 left-4 z-10 bg-white p-3 rounded-lg shadow-lg">
        <button 
          onClick={getUserLocation}
          className="bg-blue-500 text-white px-3 py-2 rounded text-sm mr-2 hover:bg-blue-600 transition-colors"
        >
           내 위치 설정
        </button>
        <button 
          onClick={clearDirections}
          className="bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600 transition-colors"
        >
           경로 지우기
        </button>
      </div>

      {/* 오른쪽 상단: 지도 컨트롤 */}
      <div className="absolute top-14 right-4 z-10 flex flex-col gap-2">
        <button 
          className="bg-white px-4 py-2 shadow rounded hover:bg-gray-50 transition-colors" 
          onClick={onZoomIn}
        >
          ＋ 확대
        </button>
        <button 
          className="bg-white px-4 py-2 shadow rounded hover:bg-gray-50 transition-colors" 
          onClick={onZoomOut}
        >
          － 축소
        </button>
                 <button 
           className="bg-white px-4 py-2 shadow rounded hover:bg-gray-50 transition-colors" 
           onClick={onCenter}
         >
           현위치
         </button>
         {previousCenter && (
           <button 
             className="bg-blue-500 text-white px-4 py-2 shadow rounded hover:bg-blue-600 transition-colors" 
             onClick={goBackToPreviousLocation}
           >
            돌아가기
           </button>
         )}
      </div>
    </div>
  );
}

export default NaverMap;