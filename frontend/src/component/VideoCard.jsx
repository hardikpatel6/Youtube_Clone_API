import { useNavigate } from "react-router-dom";
import { timeAgo } from "../utils/timeAgo";

const VideoCard = ({ video }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/videos/${video._id}`)}
      className="mt-5 ml-7 cursor-pointer w-[300] group"
    >
      <div className="w-full h-[170] overflow-hidden rounded-xl">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="mt-3">
        <h4 className="font-semibold text-sm line-clamp-2">
          {video.title}
        </h4>
        <p className="text-gray-600 text-sm mt-1">
          {video.description}
        </p>
        <p className="text-gray-500 text-xs mt-1">
         {video.viewedBy.length || 0 } • {timeAgo(video.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default VideoCard;
