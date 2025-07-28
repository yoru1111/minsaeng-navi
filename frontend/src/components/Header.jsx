import { useNavigate } from 'react-router-dom';

function Header({ currentState }) {
  const navigate = useNavigate();

  const handleUserInfoClick = () => {
    navigate('/settings', {
      state: currentState
    });
  };

  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">가게 웹</h1>
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
  