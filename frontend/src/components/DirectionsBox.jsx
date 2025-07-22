import React from 'react';

function DirectionsBox() {
  return (
    <div className="bg-white p-4 shadow rounded">
      <input
        type="text"
        placeholder="길찾기 검색"
        className="border p-2 rounded w-full"
      />
    </div>
  );
}

export default DirectionsBox;
