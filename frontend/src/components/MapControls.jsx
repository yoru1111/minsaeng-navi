function MapControls() {
    return (
      <div className="flex flex-col gap-2">
        <button className="bg-white px-4 py-2 shadow rounded">＋ 확대</button>
        <button className="bg-white px-4 py-2 shadow rounded">－ 축소</button>
        <button className="bg-white px-4 py-2 shadow rounded">📍 현위치</button>
      </div>
    );
  }
  
  export default MapControls;
  