function MapControls({ onZoomIn, onZoomOut, onCenter }) {
    return (
      <div className="flex flex-col gap-2">
        <button className="bg-white px-4 py-2 shadow rounded" onClick={onZoomIn}>＋ 확대</button>
        <button className="bg-white px-4 py-2 shadow rounded" onClick={onZoomOut}>－ 축소</button>
        <button className="bg-white px-4 py-2 shadow rounded" onClick={onCenter}>📍 현위치</button>
      </div>
    );
  }
  
  export default MapControls;