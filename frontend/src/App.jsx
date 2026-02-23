import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import VideoPlayer from "./pages/VideoPlayer";
import ProtectedRoute from "./context/ProtectedRoute";
import Navbar from "./component/Navbar";
import Upload from "./pages/Upload";
import EditPage from "./pages/EditPage";
function App() {
  return (
    <>
    <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/videos/:id" element={<VideoPlayer />} />
        <Route path="/videos/edit/:id" element={<ProtectedRoute><EditPage /></ProtectedRoute>} /> {/* Add this route for EditPage */}
      </Routes>
    </>
      
  );
}

export default App;

