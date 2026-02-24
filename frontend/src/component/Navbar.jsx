import { logoutApi } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const handleLogout = async () => {
    await logoutApi();
    localStorage.removeItem("accessToken");
    setUser(null);
    navigate("/login");
  };
  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/?search=${search}`);
  };
  return (
    <nav className="sticky top-0 z-50 bg-white border-b">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer flex items-center"
        >
          <img
            src="https://www.gstatic.com/youtube/img/branding/youtubelogo/svg/youtubelogo.svg"
            alt="YouTube"
            className="h-5 md:h-6"
          />
        </div>
        <form
          onSubmit={handleSearch}
          className="hidden md:flex w-1/2 max-w-xl"
        >
          <input
            type="text"
            placeholder="Search Based on Title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-l-full focus:outline-none"
          />
          <button
            type="submit"
            className="px-5 py-2 border border-l-0 rounded-r-full bg-gray-100 hover:bg-gray-200"
          >
            🔍
          </button>
        </form>
        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => navigate("/upload")}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
              >
                ⬆ Upload
              </button>

              <div className="px-3 py-2 bg-gray-100 rounded-full text-sm">
                {user?.name}
              </div>

              <button
                onClick={handleLogout}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
              >
                Logout
              </button>
            </div>
          )}
          {user && (
            <button
              onClick={() => setIsOpen(prev => !prev)}
              className="md:hidden text-2xl"
            >
              ☰
            </button>
          )}
        </div>
      </div>
      {isOpen && user && (
        <div className="md:hidden bg-white border-t px-4 py-3 space-y-3 shadow">
          <button
            onClick={() => {
              navigate("/upload");
              setIsOpen(false);
            }}
            className="block w-full text-left px-3 py-2 bg-gray-100 rounded"
          >
            ⬆ Upload
          </button>
          <div className="px-3 py-2 bg-gray-100 rounded">
            {user?.name}
          </div>
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="block w-full text-left px-3 py-2 bg-gray-100 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  )
};

export default Navbar;
