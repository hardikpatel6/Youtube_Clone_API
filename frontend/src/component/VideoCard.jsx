import { useNavigate } from "react-router-dom";
import { timeAgo } from "../utils/timeAgo";
import { UserCircle } from "lucide-react";

const VideoCard = ({ video }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/videos/${video._id}`)}
      className="flex flex-col gap-3 cursor-pointer group"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-gray-200">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Placeholder Duration since it doesn't exist in data usually */}
        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs font-medium px-1.5 py-0.5 rounded">
          10:24
        </div>
      </div>

      {/* Details */}
      <div className="flex gap-3">
        {/* Channel Avatar Placeholder */}
        <div className="flex-shrink-0 mt-0.5">
          {video.uploadedBy?.profilePicture ? (
            <img src={video.uploadedBy.profilePicture} alt="" className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              {video.uploadedBy?.name ? video.uploadedBy.name.charAt(0).toUpperCase() : <UserCircle size={24} />}
            </div>
          )}
        </div>

        {/* Texts */}
        <div className="flex flex-col overflow-hidden">
          <h4 className="font-semibold text-[16px] leading-[22px] text-gray-900 line-clamp-2 max-w-full">
            {video.title}
          </h4>

          <div className="text-[14px] text-gray-500 mt-1 flex flex-col">
            <span className="hover:text-gray-800 transition-colors">
              {video.uploadedBy?.name || "Unknown Channel"}
            </span>
            <div className="flex items-center text-[13px]">
              <span>{video.viewedBy?.length || 0} views</span>
              <span className="mx-1">•</span>
              <span>{timeAgo(video.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
