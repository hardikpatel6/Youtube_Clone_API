import { logoutApi } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

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
    <nav className="flex items-center justify-between px-6 py-3 border-b bg-white sticky top-0 z-50">
      <div
        onClick={() => navigate("/")}
        className="cursor-pointer flex items-center"
      >
        <img
          src="https://www.gstatic.com/youtube/img/branding/youtubelogo/svg/youtubelogo.svg"
          alt="YouTube"
          className="h-6"
        />
      </div>
      <form
        onSubmit={handleSearch}
        className="flex w-[40%]"
      >
        <input
          type="text"
          placeholder="Search Based on Title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-1 focus:ring-gray-400"
        />
        <button
          type="submit"
          className="px-5 py-2 border border-l-0 border-gray-300 rounded-r-full bg-gray-100 hover:bg-gray-200"
        >
          🔍
        </button>
      </form>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <button
              onClick={() => navigate("/upload")}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full font-medium"
            >
              ⬆ Upload
            </button>

            <div className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full font-medium">
              <h1>{user?.name}</h1>
            </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Logout
              </button>
            </>
        )}
          </div>
    </nav>
  );
};

export default Navbar;
