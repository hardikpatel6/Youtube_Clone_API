import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getVideoByIdApi,
    likeVideoApi,
    dislikeVideoApi,
    subscribeVideoApi,
    unsubscribeVideoApi,
    incrementViewCountApi,
    deleteVideoApi
} from "../api/videoApi";
import { useAuth } from "../context/AuthContext";
import CommentSection from "../component/CommentSection";
import { ThumbsUp, ThumbsDown, UserCircle, Settings, Trash2, Edit3, MoreHorizontal, Share2, Download } from "lucide-react";
import { timeAgo } from "../utils/timeAgo";

const VideoPlayer = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [dislikeCount, setDislikeCount] = useState(0);
    const [subscriberCount, setSubscriberCount] = useState(0);
    const [showFullDesc, setShowFullDesc] = useState(false);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const res = await getVideoByIdApi(id);
                const data = res.data;
                const like = await incrementViewCountApi(id);
                setVideo(data);
                setLikeCount(data.likesCount);
                setDislikeCount(data.dislikesCount);
                setSubscriberCount(data.subscribersCount);
                setIsLiked(data.isLiked);
                setIsDisliked(data.isDisliked);
                setIsSubscribed(data.isSubscribed);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchVideo();
    }, [id]);

    const handleLike = useCallback(async () => {
        if (!video?._id) return;
        try {
            const res = await likeVideoApi(video._id);
            const newLikes = res.data.likes;
            setLikeCount(newLikes);
            setIsLiked(prev => !prev);
            if (isDisliked) {
                setIsDisliked(false);
                setDislikeCount(prev => prev - 1);
            }
        } catch (error) {
            console.error(error);
        }
    }, [video, isDisliked]);

    const handleDislike = useCallback(async () => {
        if (!video?._id) return;
        try {
            const res = await dislikeVideoApi(video._id);
            const newDislikes = res.data.dislikes;
            setDislikeCount(newDislikes);
            setIsDisliked(prev => !prev);
            if (isLiked) {
                setIsLiked(false);
                setLikeCount(prev => prev - 1);
            }
        } catch (error) {
            console.error(error);
        }
    }, [video, isLiked]);

    const handleSubscribe = useCallback(async () => {
        if (!video?._id) return;
        try {
            const res = await subscribeVideoApi(video._id);
            const data = res.data;
            setIsSubscribed(true);
            setSubscriberCount(data.subscribers);
        } catch (error) {
            console.error(error);
        }
    }, [video]);

    const handleUnsubscribe = useCallback(async () => {
        if (!video?._id) return;
        try {
            const res = await unsubscribeVideoApi(video._id);
            setIsSubscribed(false);
            setSubscriberCount(res.data.subscribers);
        } catch (error) {
            console.error(error);
        }
    }, [video]);

    const handleEdit = useCallback(() => {
        if (!video?._id) return;
        navigate(`/videos/edit/${video._id}`);
    }, [navigate, video]);

    const handleDelete = useCallback(async () => {
        if (!video?._id) return;
        if (window.confirm("Are you sure you want to delete this video?")) {
            try {
                await deleteVideoApi(video._id);
                alert("Video deleted successfully");
                navigate("/");
            } catch (error) {
                console.error(error);
                alert("Failed to delete video");
            }
        }
    }, [navigate, video]);

    const isOwner = video?.uploadedBy?._id && user?.id && video.uploadedBy._id === user.id;

    if (loading)
        return <div className="text-center mt-20 text-lg font-medium text-gray-500">Loading experience...</div>;

    if (!video)
        return <div className="text-center mt-20 text-lg font-medium text-gray-500">Video not found.</div>;

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-6 lg:p-8 max-w-[1700px] mx-auto w-full bg-white">
            {/* Left Column: Video & Details */}
            <div className="flex-1 lg:max-w-[calc(100%-400px)] xl:max-w-[calc(100%-450px)]">
                {/* Video Player */}
                <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-sm w-full">
                    <video controls autoPlay className="w-full h-full object-contain">
                        <source src={video.url} type="video/mp4" />
                    </video>
                </div>

                {/* Video Title */}
                <h1 className="text-xl font-bold mt-4 text-gray-900 tracking-tight">
                    {video.title}
                </h1>

                {/* Action Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mt-3 gap-4 pb-4">
                    {/* Channel Info */}
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold overflow-hidden cursor-pointer">
                            {video.uploadedBy?.profilePicture ? (
                                <img src={video.uploadedBy.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                video.uploadedBy?.name ? video.uploadedBy.name.charAt(0).toUpperCase() : <UserCircle size={24} />
                            )}
                        </div>
                        <div className="flex flex-col justify-center cursor-pointer">
                            <span className="font-semibold text-[15px] truncate max-w-[150px]">
                                {video?.uploadedBy?.name || "Unknown Channel"}
                            </span>
                            <span className="text-[12px] text-gray-500">
                                {subscriberCount} subscribers
                            </span>
                        </div>
                        <button
                            onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
                            className={`ml-2 px-4 py-2 rounded-full font-medium text-sm transition-colors ${isSubscribed ? "bg-gray-100 text-gray-800 hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
                                }`}
                        >
                            {isSubscribed ? "Subscribed" : "Subscribe"}
                        </button>
                    </div>

                    {/* Interactions Toolbar */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                        <div className="flex items-center bg-gray-100 rounded-full">
                            <button
                                onClick={handleLike}
                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 rounded-l-full transition-colors border-r border-gray-300"
                            >
                                <ThumbsUp size={18} className={isLiked ? "fill-black" : ""} />
                                <span className="text-sm font-medium">{likeCount || 0}</span>
                            </button>
                            <button
                                onClick={handleDislike}
                                className="flex items-center px-4 py-2 hover:bg-gray-200 rounded-r-full transition-colors"
                            >
                                <ThumbsDown size={18} className={isDisliked ? "fill-black" : ""} />
                            </button>
                        </div>

                        <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors font-medium text-sm">
                            <Share2 size={18} />
                            <span className="hidden sm:inline">Share</span>
                        </button>

                        <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors font-medium text-sm">
                            <Download size={18} />
                            <span className="hidden sm:inline">Download</span>
                        </button>

                        <button className="flex items-center bg-gray-100 hover:bg-gray-200 p-2.5 rounded-full transition-colors">
                            <MoreHorizontal size={18} />
                        </button>
                    </div>
                </div>

                {/* Owner Controls */}
                {isOwner && (
                    <div className="flex gap-3 mb-4 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                        <span className="text-sm text-blue-800 font-medium flex items-center mr-auto">
                            <Settings size={16} className="mr-2" /> You own this video
                        </span>
                        <button
                            className="flex items-center gap-1.5 px-3 py-1.5 text-blue-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-100 text-sm font-medium transition-colors"
                            onClick={handleEdit}
                        >
                            <Edit3 size={16} /> Edit
                        </button>
                        <button
                            className="flex items-center gap-1.5 px-3 py-1.5 text-red-700 bg-white border border-red-200 rounded-lg hover:bg-red-100 text-sm font-medium transition-colors"
                            onClick={handleDelete}
                        >
                            <Trash2 size={16} /> Delete
                        </button>
                    </div>
                )}

                {/* Description Box */}
                <div
                    className="bg-[#f2f2f2] hover:bg-[#e5e5e5] rounded-xl p-3 cursor-pointer transition-colors mt-2"
                    onClick={() => setShowFullDesc(!showFullDesc)}
                >
                    <div className="font-semibold text-sm whitespace-pre-wrap flex items-center gap-2 mb-1">
                        <span>{video.viewedBy?.length || 0} views</span>
                        <span>{timeAgo(video.createdAt)}</span>
                    </div>
                    <div className={`text-sm text-gray-800 whitespace-pre-wrap ${!showFullDesc && 'line-clamp-2'}`}>
                        {video.description || "No description provided."}
                    </div>
                    {!showFullDesc && (
                        <button className="mt-1 font-semibold text-sm text-gray-700">Show more</button>
                    )}
                    {showFullDesc && (
                        <button className="mt-2 font-semibold text-sm text-gray-700">Show less</button>
                    )}
                </div>

                {/* Comments Section */}
                <CommentSection videoId={video?._id} />
            </div>

            {/* Right Column: Recommendations (Placeholder logic) */}
            <div className="w-full lg:w-[400px] xl:w-[450px] flex flex-col gap-4">
                <h3 className="font-semibold text-lg hidden lg:block">Up next</h3>

                {/* Generate some dummy recommended videos based on current video to fill UI */}
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <div key={num} className="flex gap-2 cursor-pointer group">
                        <div className="w-[168px] h-[94px] flex-shrink-0 bg-gray-200 rounded-xl overflow-hidden relative">
                            <img src={`https://picsum.photos/seed/${num * id}/300/200`} alt="Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-medium px-1 rounded">
                                12:34
                            </span>
                        </div>
                        <div className="flex flex-col overflow-hidden py-1">
                            <span className="text-sm font-semibold line-clamp-2 leading-tight">Recommended Video Title Example Placeholder {num}</span>
                            <span className="text-xs text-gray-500 mt-1 hover:text-gray-800 transition-colors">YouTuber Channel</span>
                            <span className="text-xs text-gray-500">{Math.floor(Math.random() * 1000)}k views • {num} days ago</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoPlayer;
