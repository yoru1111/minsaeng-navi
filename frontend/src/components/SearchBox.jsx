// components/SearchBox.jsx
import { useState } from "react";

function SearchBox({ onSearch }) {
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    if (!keyword.trim()) return;

    const geocoder = new window.naver.maps.Service.Geocoder();
    geocoder.geocode({ query: keyword }, (status, response) => {
      if (status === window.naver.maps.Service.Status.OK && response.v2.addresses.length > 0) {
        const { x, y } = response.v2.addresses[0];
        onSearch({ lat: parseFloat(y), lng: parseFloat(x) });
      } else {
        alert("위치를 찾을 수 없습니다.");
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="장소 검색"
        className="border px-2 py-1 rounded text-sm"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
      >
        검색
      </button>
    </div>
  );
}

export default SearchBox;
