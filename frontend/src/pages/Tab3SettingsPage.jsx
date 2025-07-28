import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AreaSelector from '../components/AreaSelector';
import CategorySelector from '../components/CategorySelector';
import Header from '../components/Header';

function Tab3SettingsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [area, setArea] = useState("");
  const [si, setSi] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state) {
      setArea(location.state.area || "");
      setSi(location.state.si || "");
      setCategories(location.state.categories || []);
    }
  }, [location.state]);

  const handleSaveSettings = () => {
    if (!area || !si || categories.length === 0) {
      setError("지역과 관심분야를 모두 선택해주세요.");
      return;
    }
    setError("");
    navigate("/map", { state: { area, si, categories } });
  };

  const handleBackToMap = () => {
    navigate("/map", { state: location.state });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">내 정보 설정</h1>
          
          {/* 현재 설정 표시 */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">현재 설정</h2>
            <p className="text-blue-700">
              <strong>지역:</strong> {area} {si && `> ${si}`}
            </p>
            <p className="text-blue-700">
              <strong>관심분야:</strong> {categories.length > 0 ? categories.join(', ') : '없음'}
            </p>
          </div>

          {/* 오류 메시지 */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* 지역 변경 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">지역 변경</h2>
            <div className="flex justify-center">
              <AreaSelector onSelect={({ type, value, parent }) => {
                console.log('Tab3에서 받은 지역 선택:', { type, value, parent });
                if (type === 'do') {
                  setArea(value);
                  setSi(""); // 도 변경시 시 초기화
                } else if (type === 'si') {
                  setSi(value);
                }
                setError("");
              }} />
            </div>
          </div>

          {/* 관심분야 변경 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">관심분야 변경</h2>
            <div className="flex justify-center">
              <CategorySelector
                initialValues={categories}
                onChange={(selectedCategories) => {
                  console.log('Tab3에서 받은 카테고리:', selectedCategories);
                  setCategories(selectedCategories);
                  setError("");
                }}
              />
            </div>
          </div>

          {/* 버튼들 */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleBackToMap}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSaveSettings}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            >
              지도 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tab3SettingsPage; 