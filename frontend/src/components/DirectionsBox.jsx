import React, { useState } from "react";

function DirectionsBox({ onSearch, stores }) {
  const [term, setTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSearch) onSearch(term);

    const matched = stores.find((store) =>
      store.name.includes(term)
    );

    if (matched) {
      const { lat, lng } = matched;
      // 내장 네이버 지도 API 길찾기 기능 사용
      if (window.showDirections) {
        window.showDirections(lat, lng);
      } else {
        // 지도가 아직 로드되지 않은 경우 안내 메시지
        alert("지도가 로드 중입니다. 잠시 후 다시 시도해주세요.");
      }
    } else {
      alert("해당 이름의 매장을 찾을 수 없습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded">
      <input
        type="text"
        placeholder="길찾기 검색"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        className="border p-2 rounded w-full"
      />
    </form>
  );
}

export default DirectionsBox;