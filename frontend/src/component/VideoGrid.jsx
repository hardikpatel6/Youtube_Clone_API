import { useVideos } from "../context/VideoContext";
import VideoCard from "./VideoCard";

const VideoGrid = () => {
  const { videos, loading, notFound } = useVideos();
  console.log("videos", videos);

  if (loading)
    return <div className="flex justify-center mt-10"><p className="text-gray-500 font-medium tracking-wide">Loading videos...</p></div>;

  if (notFound || !videos || videos.length === 0)
    return <div className="flex justify-center mt-10"><p className="text-gray-500 font-medium tracking-wide">No videos found.</p></div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-10">
      {videos.map(video => (
        <VideoCard
          key={video._id}
          video={video}
        />
      ))}
    </div>
  );
};

export default VideoGrid;
