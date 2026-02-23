import { createContext, useContext, useState, useEffect } from "react";
import { getVideosApi, uploadVideoApi, searchVideosApi} from "../api/videoApi";
import { useLocation } from "react-router-dom";
const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const location = useLocation();
  const uploadVideo = async (formData) => {
    try {
      setLoading(true);
      const res = await uploadVideoApi(formData);
      setVideos((prev) => [res.data, ...prev]);
      return res.data;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams(location.search);
        const searchQuery = params.get("search");
        let res;
        if (searchQuery) {
          res = await searchVideosApi(searchQuery);
          if (res.data.length === 0) {
            setNotFound(true);
            setVideos([]);
          } else {
            setNotFound(false);
            setVideos(res.data);
          }
        } else {
          res = await getVideosApi();
          setNotFound(false);
          setVideos(res.data);
        }
      } catch (err) {
        console.error(error);
        setVideos([]);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, [location.search]);

  return (
    <VideoContext.Provider value={{ videos, setVideos, uploadVideo, loading , notFound }}>
      {children}
    </VideoContext.Provider>
  );
};
export const useVideos = () => useContext(VideoContext);
