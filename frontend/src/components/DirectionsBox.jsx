import React, { useState } from "react";

function DirectionsBox({ onSearch, stores }) {
  const [term, setTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSearch) onSearch(term);

    // 검색어가 있으면 필터링된 결과를 보여주기만 하고
    // 길찾기는 별도의 버튼으로 처리
    if (term.trim() === "") {
      // 검색어가 비어있으면 전체 매장 표시
      return;
    }

    const matched = stores.find((store) =>
      store.name.toLowerCase().includes(term.toLowerCase())
    );

    if (!matched) {
      alert("해당 이름의 매장을 찾을 수 없습니다.");
    }
    // 매장을 찾았으면 자동으로 필터링되어 표시됩니다.
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded">
      <input
        type="text"
        placeholder="매장명 검색"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        className="border p-2 rounded w-full"
      />
    </form>
  );
}

export default DirectionsBox;
