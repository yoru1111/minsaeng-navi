import React, { useState, useEffect } from 'react';

const DO_SI_MAP = {
  '서울특별시': ['종로구', '중구', '용산구', '성동구', '광진구', '동대문구', '중랑구', '성북구', '강북구', '도봉구', '노원구', '은평구', '서대문구', '마포구', '양천구', '강서구', '구로구', '금천구', '영등포구', '동작구', '관악구', '서초구', '강남구', '송파구', '강동구'],
  '경기도': ['수원시', '성남시', '고양시', '용인시', '부천시', '안산시', '안양시', '평택시', '시흥시', '광명시', '김포시', '광주시', '이천시', '여주시', '양평군', '포천시', '동두천시', '과천시', '구리시', '남양주시', '오산시', '군포시', '하남시', '의왕시', '의정부시', '파주시'],
  '부산광역시': ['중구', '서구', '동구', '영도구', '부산진구', '동래구', '남구', '북구', '해운대구', '사하구', '금정구', '강서구', '연제구', '수영구', '사상구', '기장군'],
  '대구광역시': ['중구', '동구', '서구', '남구', '북구', '수성구', '달서구', '달성군'],
  '인천광역시': ['중구', '동구', '미추홀구', '연수구', '남동구', '부평구', '계양구', '서구', '강화군', '옹진군'],
  '광주광역시': ['동구', '서구', '남구', '북구', '광산구'],
  '대전광역시': ['동구', '중구', '서구', '유성구', '대덕구'],
  '울산광역시': ['중구', '남구', '동구', '북구', '울주군'],
  '강원특별자치도': ['춘천시', '원주시', '강릉시', '동해시', '태백시', '속초시', '삼척시', '홍천군', '횡성군', '영월군', '평창군', '정선군', '철원군', '화천군', '양구군', '인제군', '고성군', '양양군'],
  '경상북도': ['포항시', '경주시', '구미시', '김천시', '안동시', '영주시', '영천시', '상주시', '문경시', '예천군', '봉화군', '울진군', '울릉군'],
  '경상남도': ['창원시', '진주시', '김해시', '양산시', '거제시', '통영시', '밀양시', '사천시', '함안군', '의령군', '창녕군', '고성군', '남해군', '하동군'],
  '전라북도': ['전주시', '군산시', '익산시', '정읍시', '남원시', '김제시', '완주군', '진안군', '무주군', '장수군', '임실군', '순창군'],
  '전라남도': ['여수시', '순천시', '목포시', '나주시', '광양시', '담양군', '곡성군', '구례군', '고흥군', '보성군', '화순군', '장흥군', '강진군', '해남군', '영암군', '무안군', '신안군'],
  '세종특별자치시': ['세종시'],
  '충청북도': ['청주시', '충주시', '제천시', '보은군', '옥천군', '영동군', '진천군', '괴산군', '음성군', '단양군'],
  '충청남도': ['천안시', '아산시', '서산시', '논산시', '공주시', '보령시', '계룡시', '당진시', '금산군', '부여군', '서천군', '청양군', '홍성군', '예산군', '태안군'],
 '제주특별자치도': ['제주시', '서귀포시'],
};

const DO_LIST = Object.keys(DO_SI_MAP);

function AreaSelector({ onSelect, initialDo = '', initialSi = '' }) {
  const [selectedDo, setSelectedDo] = useState(initialDo);
  const [selectedSi, setSelectedSi] = useState(initialSi);

  // 초기값이 변경될 때 상태 업데이트
  useEffect(() => {
    setSelectedDo(initialDo);
    setSelectedSi(initialSi);
  }, [initialDo, initialSi]);

  const handleDoChange = (e) => {
    setSelectedDo(e.target.value);
    setSelectedSi(''); // 도를 바꾸면 시/군/구 선택 초기화
    if (onSelect) onSelect({ type: 'do', value: e.target.value });
  };
  const handleSiChange = (e) => {
    setSelectedSi(e.target.value);
    if (onSelect) onSelect({ type: 'si', value: e.target.value, parent: selectedDo });
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
      {selectedDo && selectedDo !== "세종특별자치시" && (
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
  