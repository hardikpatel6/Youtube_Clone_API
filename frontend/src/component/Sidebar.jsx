import { Home, Compass, PlaySquare, Clock, History, ThumbsUp, Play, Film } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { name: "Home", icon: <Home size={24} />, path: "/" },
    { name: "Shorts", icon: <Compass size={24} />, path: "/" },
    { name: "Subscriptions", icon: <Play size={24} />, path: "/" },
    { divider: true },
    { name: "Library", icon: <Film size={24} />, path: "/" },
    { name: "History", icon: <History size={24} />, path: "/" },
    { name: "Your Videos", icon: <PlaySquare size={24} />, path: "/upload" },
    { name: "Watch Later", icon: <Clock size={24} />, path: "/" },
    { name: "Liked Videos", icon: <ThumbsUp size={24} />, path: "/" },
  ];

  return (
    <aside
      className={`fixed md:sticky top-[60px] left-0 h-[calc(100vh-60px)] z-40 bg-white transition-transform transform ${
        isOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full md:w-20 md:translate-x-0"
      } overflow-y-auto custom-scrollbar flex-shrink-0`}
    >
      <div className="flex flex-col py-3">
        {links.map((link, idx) => {
          if (link.divider) return <div key={idx} className="my-3 border-t border-gray-200" />;
          const isActive = location.pathname === link.path && link.name === "Home"; // Simplified active state
          return (
            <button
              key={link.name}
              onClick={() => navigate(link.path)}
              className={`flex items-center px-4 py-3 mx-2 rounded-lg hover:bg-gray-100 transition-colors ${
                isActive ? "bg-gray-100 font-semibold" : "font-normal"
              } ${
                isOpen
                  ? "justify-start"
                  : "md:justify-center md:flex-col md:px-0 md:py-4 justify-start truncate hidden md:flex"
              }`}
            >
              <div className={`${isActive ? "text-gray-900" : "text-gray-700"} flex-shrink-0`}>
                {link.icon}
              </div>
              <span
                className={`${
                  isOpen
                    ? "ml-6 block text-[15px] truncate"
                    : "md:mt-1 md:text-[10px] md:block hidden ml-6 md:ml-0 truncate"
                }`}
              >
                {link.name}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
