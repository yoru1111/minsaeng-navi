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
    // 세종특별자치시는 시군구 선택 없이도 허용
    const isSejong = area === "세종특별자치시";
    
    // 지역 선택 여부 확인 (세종특별자치시는 시군구 필요 없음)
    const isAreaComplete = area && (isSejong || si);
    const isCategoriesComplete = categories.length > 0;
    
    // 세분화된 오류 메시지
    if (!isAreaComplete && !isCategoriesComplete) {
      setError("지역과 관심분야를 선택해주세요.");
      return;
    } else if (!isAreaComplete) {
      setError("지역을 선택해주세요.");
      return;
    } else if (!isCategoriesComplete) {
      setError("관심분야를 선택해주세요.");
      return;
    }
    
    setError(""); // 에러 초기화
    navigate("/map", {
      state: {
        area,       // 도
        si: isSejong ? "" : si,         // 세종특별자치시는 빈 문자열
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
                if (type === "do") {
                  setArea(value);
                  setSi('');
                }
                if (type === "si") {
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

        {/* 오류 메시지 */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded max-w-xs mx-auto">
            {error}
          </div>
        )}

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
