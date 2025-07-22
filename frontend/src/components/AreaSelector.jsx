import React, { useState } from 'react';

const DO_SI_MAP = {
  '경기도': ['수원시', '성남시', '고양시', '용인시', '부천시'],
  '강원도': ['춘천시', '강릉시', '원주시', '동해시'],
  '충청북도': ['청주시', '충주시', '제천시'],
  '충청남도': ['천안시', '아산시', '서산시'],
  '전라북도': ['전주시', '군산시', '익산시'],
  '전라남도': ['여수시', '순천시', '목포시'],
  '경상북도': ['포항시', '경주시', '구미시'],
  '경상남도': ['창원시', '진주시', '김해시'],
};

const DO_LIST = Object.keys(DO_SI_MAP);

function AreaSelector({ onSelect }) {
  const [selectedDo, setSelectedDo] = useState('');
  const [selectedSi, setSelectedSi] = useState('');

  const handleDoChange = (e) => {
    setSelectedDo(e.target.value);
    setSelectedSi(''); // 도를 바꾸면 시/군/구 선택 초기화
    if (onSelect) onSelect({ type: '도', value: e.target.value });
  };
  const handleSiChange = (e) => {
    setSelectedSi(e.target.value);
    if (onSelect) onSelect({ type: '시', value: e.target.value, parent: selectedDo });
  };

  return (
    <div className="w-full max-w-xs mx-auto flex flex-col gap-4">
      <select
        className="w-full border p-2 rounded"
        value={selectedDo}
        onChange={handleDoChange}
      >
        <option value="">도 선택</option>
        {DO_LIST.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
      {selectedDo && (
        <select
          className="w-full border p-2 rounded"
          value={selectedSi}
          onChange={handleSiChange}
        >
          <option value="">시/군/구 선택</option>
          {DO_SI_MAP[selectedDo].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      )}
    </div>
  );
}

export default AreaSelector;
  