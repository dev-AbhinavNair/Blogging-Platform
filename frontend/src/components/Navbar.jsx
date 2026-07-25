import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-lg font-bold text-blue-600">
            BlogPlatform
          </Link>
          {user && (
            <div className="hidden sm:flex items-center gap-4">
              <Link to="/" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link to="/dashboard" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
              <Link to="/categories" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                Categories
              </Link>
              <Link
                to="/blog/new"
                className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
              >
                New Post
              </Link>
            </div>
          )}
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 hidden sm:block">{user.name}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
