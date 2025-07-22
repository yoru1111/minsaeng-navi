import React, { useState } from 'react';

const CATEGORIES = [
  { key: 'food', label: '음식', img: '🍔' },
  { key: 'culture', label: '문화', img: '🎭' },
  { key: 'shopping', label: '쇼핑', img: '🛍️' },
  { key: 'sports', label: '운동', img: '🏃' },
  { key: 'travel', label: '여행', img: '✈️' },
  { key: 'it', label: 'IT', img: '💻' },
  { key: 'fashion', label: '패션', img: '👗' },
  { key: 'pet', label: '반려동물', img: '🐶' },
  { key: 'education', label: '교육', img: '📚' },
  { key: 'health', label: '건강', img: '💪' },
  { key: 'art', label: '예술', img: '🎨' },
  { key: 'etc', label: '기타', img: '✨' },
];

function CategorySelector({ onChange }) {
  const [selected, setSelected] = useState([]);

  const handleCheck = (key) => {
    setSelected((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      if (onChange) onChange(next);
      return next;
    });
  };

  return (
    <div className="grid grid-cols-3 gap-4 w-full max-w-md">
      {CATEGORIES.map((cat) => (
        <label key={cat.key} className="flex flex-col items-center cursor-pointer p-2 border rounded shadow-sm hover:shadow-md transition">
          <span className="text-4xl mb-2">{cat.img}</span>
          <span className="mb-1 text-sm">{cat.label}</span>
          <input
            type="checkbox"
            checked={selected.includes(cat.key)}
            onChange={() => handleCheck(cat.key)}
            className="accent-blue-500"
          />
        </label>
      ))}
    </div>
  );
}

export default CategorySelector;
  