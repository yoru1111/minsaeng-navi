import { useEffect } from "react";

function RouteModal({ visible, onClose, summary }) {
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-80 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✖
        </button>
        <h2 className="text-lg font-bold mb-4">🚗 경로 요약</h2>
        <div>
          <p><strong>매장명:</strong> {summary?.storeName}</p>
          <p><strong>거리:</strong> {summary?.distance}</p>
          <p><strong>예상 시간:</strong> {summary?.duration}</p>
        </div>
      </div>
    </div>
  );
}

export default RouteModal;
