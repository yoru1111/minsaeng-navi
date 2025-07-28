import AreaSelector from "../components/AreaSelector";
import CategorySelector from "../components/CategorySelector";
import HeaderTab1 from "../layout/Header1";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Tab1SelectPage() {
  const navigate = useNavigate();
  const [area, setArea] = useState("");
  const [si, setSi] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(""); // 경고 문구 상태 추가

  const handleMapClick = () => {
    if (!area || !si || categories.length === 0) {
      setError("지역/관심분야 을/를 선택해주세요.");
      return;
    }
    setError(""); // 에러 초기화
    navigate("/map", {
      state: {
        area,       // 도
        si,         // 시/군/구
        categories  // ['food', 'it', ...]
      }
    });
  };

  return (
    <div className="min-h-screen">
      <HeaderTab1 />
      <div className="flex flex-col items-center justify-center gap-8">
        <h1 className="text-2xl font-bold mb-4">지역 선택</h1>
        <div className="flex flex-col items-center w-full" style={{ minHeight: 120 }}>
          <AreaSelector
            onSelect={({ type, value, parent }) => {
              setTimeout(() => {
                if (type === "도") {
                  setArea(value);
                  setSi('');
                }
                if (type === "시") {
                  setArea(parent);
                  setSi(value);
                }
                setError(""); // 지역 선택 시 에러 메시지 제거
              }, 0);
            }}
          />
        </div>

        <h1 className="text-2xl font-bold mb-4">관심분야 선택</h1>
        
        {/* 선택된 카테고리 표시 */}
        {categories.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 font-medium">
              선택된 관심분야: {categories.join(', ')}
            </p>
          </div>
        )}
        
        <CategorySelector
          initialValues={categories}
          onChange={(selected) => {
            setTimeout(() => {
              console.log('Tab1에서 받은 카테고리:', selected);
              setCategories(selected);
              setError(""); // 관심분야 선택 시 에러 메시지 제거
            }, 0);
          }}
        />

        <div className="h-6 flex items-center justify-center">
          {error && (
            <div className="text-red-500 font-semibold">{error}</div>
          )}
        </div>

        <button
          onClick={handleMapClick}
          className="bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-600 transition-colors"
        >
          지도 보기
        </button>
      </div>
    </div>
  );
}

export default Tab1SelectPage;
