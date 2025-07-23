import { useEffect } from "react";

function NaverMap({ stores, center, selected }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=01dip867u8";


    script.async = true;
    script.onload = () => {
      const map = new window.naver.maps.Map("map", {
        center: new window.naver.maps.LatLng(center.lat, center.lng),
        zoom: 14,
      });

      const markers = [];

      stores.forEach((store) => {
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(store.lat, store.lng),
          map,
          icon: {
            content: `
              <div style="
                width: 14px;
                height: 14px;
                background: ${store.available ? "green" : "gray"};
                border-radius: 50%;
                border: 2px solid white;
              "></div>`,
            size: new window.naver.maps.Size(14, 14),
            anchor: new window.naver.maps.Point(7, 7),
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
  }, [stores, center, selected]);

  return <div id="map" className="w-full h-full" style={{ minHeight: "500px" }}></div>;
}

export default NaverMap;
