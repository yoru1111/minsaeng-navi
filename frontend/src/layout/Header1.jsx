function HeaderTab1() {
  const handleLogoClick = () => {
    window.location.reload();
  };

  return (
    <header className="w-full bg-white flex items-center px-2 sm:px-3 py-1 sm:py-1.5 mb-8 shadow-sm">
      <div className="flex items-center gap-1.5">
        <img
          src="/3034007-slide-s-3-whats-the-difference-between-a-logo-and-a-symbol.ico" // 노란색 배경에 + 로고 (예시)
          alt="로고"
          width={55}   // 사이즈를 48px로 늘림
          height={55}  // 사이즈를 48px로 늘림
          className="rounded cursor-pointer"
          onClick={handleLogoClick}
        />
        <span className="font-bold text-base sm:text-lg text-gray-700">민생네비</span>
      </div>
    </header>
  );
}

export default HeaderTab1;
