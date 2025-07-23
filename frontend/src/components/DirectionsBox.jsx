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
      const { lat, lng, name } = matched;
      const directionUrl = `https://map.naver.com/v5/directions?c=15.00,0,0,0,dh&destination=${lng},${lat},${name},PLACE`;
      window.open(directionUrl, "_blank");
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
