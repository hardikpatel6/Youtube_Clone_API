import { useEffect, useState } from "react";
import { useParams , useNavigate } from "react-router-dom";
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
const VideoPlayer = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();
    console.log("user", user?.id);
    const [video, setVideo] = useState(null);
    console.log("video", video?.uploadedBy?._id);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [dislikeCount, setDislikeCount] = useState(0);
    const [subscriberCount, setSubscriberCount] = useState(0);
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
    const handleLike = async () => {
        try {
            const res = await likeVideoApi(video._id);
            const newLikes = res.data.likes;
            setLikeCount(newLikes);
            // toggle state
            setIsLiked(prev => !prev);
            // remove dislike if exists
            if (isDisliked) {
                setIsDisliked(false);
                setDislikeCount(prev => prev - 1);
            }
        } catch (error) {
            console.error(error);
        }
    };
    const handleDislike = async () => {
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
    };
    const handleSubscribe = async () => {
        try {
            const res = await subscribeVideoApi(video._id);
            const data = res.data;
            setIsSubscribed(true);
            setSubscriberCount(data.subscribers);
        } catch (error) {
            console.error(error);
        }
    };
    const handleUnsubscribe = async () => {
        try {
            const res = await unsubscribeVideoApi(video._id);
            setIsSubscribed(false);
            setSubscriberCount(res.data.subscribers);
        } catch (error) {
            console.error(error);
        }
    };
    const handleEdit = () => {
        // navigate to edit page
        console.log("Navigate to edit page for video id:", video._id);
        navigate(`/videos/edit/${video._id}`);
    };
    const handleDelete = async () => {
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
    };
    if (loading)
        return <div className="text-center mt-10">Loading...</div>;
    if (!video)
        return <div className="text-center mt-10">Video not found</div>;
    return (
        <>
            <div className="flex justify-center px-4 mt-6">
                <div className="w-full max-w-4xl">
                    <div className="aspect-video bg-black rounded-xl overflow-hidden">
                        <video controls className="w-full h-full">
                            <source src={video.url} type="video/mp4" />
                        </video>
                    </div>
                    {
                        video.uploadedBy._id === user?.id && (
                            <button className={`mt-3 px-4 py-2 text-white rounded ${isLiked ? "bg-blue-700" : "bg-blue-500"
                                }`} onClick={handleEdit}>Edit Video </button>
                        )
                    }
                    {
                        video.uploadedBy._id === user?.id && (
                            <button className={`ml-2 mt-3 px-4 py-2 text-white rounded ${isLiked ? "bg-red-700" : "bg-red-500"
                                }`} onClick={handleDelete}>Delete Video </button>
                        )
                    }
                    <h1 className="text-xl font-semibold mt-4">
                        {video.title}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {video.description}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                        {video.uploadedBy.email}
                    </p>
                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={handleLike}
                            className={`px-4 py-2 text-white rounded ${isLiked ? "bg-blue-700" : "bg-blue-500"
                                }`}
                        >
                            👍
                        </button>
                        <p className="ml-2 mt-2 text-gray-600">{likeCount}</p>
                        <button
                            onClick={handleDislike}
                            className={`px-4 py-2 text-white rounded ${isDisliked ? "bg-red-700" : "bg-red-500"
                                }`}
                        >
                            👎
                        </button>
                        <p className="ml-2 mt-2 text-gray-600">{dislikeCount}</p>
                        <button
                            onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
                            className={`px-4 py-2 text-white rounded ${isSubscribed ? "bg-gray-700" : "bg-gray-500"
                                }`}
                        >
                            {isSubscribed ? "Subscribed" : "Subscribe"}
                        </button>
                        <p className="ml-2 mt-2 text-gray-600">{subscriberCount}</p>
                    </div>
                </div>
            </div>
            <CommentSection videoId={video._id} />
        </>
    );
};

export default VideoPlayer;
