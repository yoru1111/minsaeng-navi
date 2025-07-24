import AreaSelector from "../components/AreaSelector";
import CategorySelector from "../components/CategorySelector";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Tab1SelectPage() {
  const navigate = useNavigate();
  const [area, setArea] = useState("");
  const [si, setSi] = useState("");
  const [categories, setCategories] = useState([]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8">
      <h1 className="text-2xl font-bold mb-4">지역 선택</h1>
      <AreaSelector
        onSelect={({ type, value, parent }) => {
          if (type === "도") setArea(value);
          if (type === "시") setSi(value);
        }}
      />

      <h1 className="text-2xl font-bold mb-4">관심분야 선택</h1>
      <CategorySelector onChange={(selected) => setCategories(selected)} />

      <button
       onClick={() =>
          navigate("/map", {
            state: {
              area,       // 도
              si,         // 시
              categories  // ['food', 'it', ...]
            }
          })
        }

        className="bg-blue-500 text-white px-6 py-2 rounded mt-8"
      >
        지도 보기
      </button>
    </div>
  );
}

export default Tab1SelectPage;
