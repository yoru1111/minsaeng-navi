import AreaSelector from "../components/AreaSelector";
import CategorySelector from "../components/CategorySelector";
import { useNavigate } from "react-router-dom";

function Tab1SelectPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8">
      <h1 className="text-2xl font-bold mb-4">지역 선택</h1>
      <AreaSelector />
      <h1 className="text-2xl font-bold mb-4">관심분야 선택</h1>
      <CategorySelector />
      <button
        onClick={() => navigate("/map")}
        className="bg-blue-500 text-white px-6 py-2 rounded mt-8"
      >
        지도 보기
      </button>
    </div>
  );
}

export default Tab2MapPage;