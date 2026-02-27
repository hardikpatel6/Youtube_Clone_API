import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import VideoPlayer from "./pages/VideoPlayer";
import ProtectedRoute from "./context/ProtectedRoute";
import Navbar from "./component/Navbar";
import Sidebar from "./component/Sidebar";
import Upload from "./pages/Upload";
import EditPage from "./pages/EditPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Auto-collapse sidebar on smaller screens or specific pages
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Close sidebar on Video details page to give more space
    if (location.pathname.startsWith("/videos/")) {
      setIsSidebarOpen(false);
    } else {
      handleResize(); // trigger initial state
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [location.pathname]);

  const hideBarsRoutes = ["/login", "/signup", "/forgot-password", "/reset-password"];
  const shouldHideBars = hideBarsRoutes.some(route => location.pathname.startsWith(route));

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-hidden w-full h-full">
      {!shouldHideBars && <Navbar toggleSidebar={toggleSidebar} />}
      <div className="flex flex-1 overflow-hidden">
        {!shouldHideBars && <Sidebar isOpen={isSidebarOpen} />}

        <main className={`flex-1 overflow-y-auto w-full`}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            {/* Keeping everything Protected but allowing viewing, wait original has everything Protected except VideoPlayer and Login/Signup */}
            <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/videos/:id" element={<ProtectedRoute><VideoPlayer /></ProtectedRoute>} />
            <Route path="/videos/edit/:id" element={<ProtectedRoute><EditPage /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;

