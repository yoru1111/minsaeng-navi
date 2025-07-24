import { useEffect, useRef } from "react"; // useRef 추가

function NaverMap({ stores, center, selected, onMapLoad }) { // onMapLoad 프롭 추가
  const mapRef = useRef(null); // 지도 객체를 저장할 ref

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=01dip867u8";

    script.async = true;
    script.onload = () => {
      const map = new window.naver.maps.Map("map", {
        center: new window.naver.maps.LatLng(center.lat, center.lng),
        zoom: 14,
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
                  onclick="window.open('https://map.naver.com/v5/directions?c=15.00,0,0,0,dh&destination=${store.lng},${store.lat},${encodeURIComponent(store.name)},PLACE','_blank')" 
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
          content: `<div style="padding: 4px 8px;">${store.name}</div>`,
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
    };
    document.head.appendChild(script);

    return () => { // 컴포넌트 언마운트 시 스크립트 제거 (선택 사항)
      // document.head.removeChild(script);
      // map 인스턴스 정리 (필요하다면)
    };
  }, [stores, center, selected]); // 의존성 배열에 onMapLoad는 넣지 않아도 됨

  return <div id="map" className="w-full h-full" style={{ minHeight: "500px" }}></div>;
}

export default NaverMap;