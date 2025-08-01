import { useNavigate } from 'react-router-dom';

function Header({ currentState }) {
  const navigate = useNavigate();

  const handleUserInfoClick = () => {
    navigate('/settings', {
      state: currentState
    });
  };

  const handleLogoClick = () => {
    window.location.reload();
  };

  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <img 
          src="/icon.png" 
          alt="민생네비 아이콘" 
          width={40}
          height={40}
          className="object-contain cursor-pointer"
          onClick={handleLogoClick}
        />
        <h1 className="text-xl font-bold">민생네비</h1>
      </div>
      <button 
        onClick={handleUserInfoClick}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        내 정보
      </button>
    </header>
  );
}

export default Header;
  