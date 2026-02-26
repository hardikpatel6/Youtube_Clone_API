import { logoutApi } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Search, Menu, Video, Bell, UserCircle } from "lucide-react";

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error("Logout failed API side", err);
    }
    logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/?search=${search}`);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white h-[60px] flex items-center justify-between px-4 w-full">
      {/* Left Section: Menu & Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Menu size={24} className="text-gray-800" />
        </button>
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer flex items-center gap-1"
        >
          { /* Instead of a broken SVG logo link, we use standard Youtube styles */}
          <div className="bg-red-600 text-white p-1 rounded-lg flex items-center justify-center h-7 w-8">
            <svg height="20" viewBox="0 0 24 24" width="20" fill="currentColor">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
          </div>
          <span className="font-semibold text-xl tracking-tighter hidden sm:block">YouTube</span>
        </div>
      </div>

      {/* Middle Section: Search Bar */}
      <form
        onSubmit={handleSearch}
        className="hidden sm:flex flex-1 max-w-[600px] ml-10 mr-4"
      >
        <div className="flex w-full border border-gray-300 rounded-full overflow-hidden focus-within:border-blue-500 ml-2">
          {/* Magnifying Glass Icon left side */}
          <div className="hidden sm:flex items-center justify-center px-4 bg-gray-50 border-r border-gray-300">
            <Search size={18} className="text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 w-full focus:outline-none"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-gray-50 hover:bg-gray-100 border-l border-gray-300 transition-colors"
          >
            <Search size={20} className="text-gray-600" />
          </button>
        </div>
      </form>

      {/* Right Section: Icons & Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button className="sm:hidden p-2 hover:bg-gray-100 rounded-full">
          <Search size={24} className="text-gray-800" />
        </button>
        {user ? (
          <>
            <button
              onClick={() => navigate("/upload")}
              className="p-2 hover:bg-gray-100 rounded-full hidden sm:block"
              title="Create"
            >
              <Video size={24} className="text-gray-800" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full hidden sm:block">
              <Bell size={24} className="text-gray-800" />
            </button>
            <div className="relative">
              <div className="flex items-center gap-2">
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {user.name}
                </span>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : <UserCircle size={24} />}
                </button>
              </div>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate("/upload");
                    }}
                    className="block sm:hidden w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Upload Video
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 border border-blue-600 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-50 font-medium whitespace-nowrap"
          >
            <UserCircle size={20} />
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
