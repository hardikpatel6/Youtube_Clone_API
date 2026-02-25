import { useEffect, useState, useCallback } from "react";
import {
    getCommentsApi,
    addCommentApi,
    updateCommentApi,
    deleteCommentApi,
    likeCommentApi,
    dislikeCommentApi
} from "../api/commentApi";

import { useAuth } from "../context/AuthContext";
import { UserCircle, MoreVertical, ThumbsUp, ThumbsDown } from "lucide-react";

const CommentSection = ({ videoId }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");
    const [showCommentButtons, setShowCommentButtons] = useState(false);

    const fetchComments = useCallback(
        async () => {
            try {
                const res = await getCommentsApi(videoId);
                setComments(res.data);
            } catch (error) {
                console.error(error);
            }
        }, [videoId]);

    useEffect(() => {
        fetchComments();
    }, [videoId]);

    const handleAddComment = useCallback(
        async () => {
            if (!newComment.trim()) return;
            try {
                const res = await addCommentApi(videoId, newComment);
                const newCommentObj = {
                    ...res.data.comment,
                    user_id: {
                        _id: user.id,
                        name: user.name
                    }
                };
                setComments(prev => [newCommentObj, ...prev]);
                setNewComment("");
                setShowCommentButtons(false);
            } catch (error) {
                console.error(error);
            }
        }, [newComment, videoId, user]);

    const handleEditClick = useCallback(
        (comment) => {
            setEditingId(comment._id);
            setEditText(comment.commentText);
        }, []);

    const handleUpdateComment = useCallback(
        async (commentId) => {
            if (!editText.trim()) return;
            try {
                const res = await updateCommentApi(commentId, editText);
                setComments(prev =>
                    prev.map(comment =>
                        comment._id === commentId
                            ? {
                                ...comment,
                                commentText: editText
                            }
                            : comment
                    )
                );
                setEditingId(null);
                setEditText("");
            } catch (error) {
                console.error(error);
            }
        }, [editText]);

    const handleDelete = useCallback(
        async (commentId) => {
            try {
                await deleteCommentApi(commentId);
                setComments(prev =>
                    prev.filter(comment => comment._id !== commentId)
                );
            } catch (error) {
                console.error(error);
            }
        }, []);

    const handleLikeComment = useCallback(async (commentId) => {
        try {
            const res = await likeCommentApi(commentId);
            const { likesCount, isLiked } = res.data;
            setComments(prev =>
                prev.map(comment =>
                    comment._id === commentId
                        ? {
                            ...comment,
                            likesCount,
                            isLiked,
                            isDisliked: isLiked ? false : comment.isDisliked,
                            dislikesCount: isLiked && comment.isDisliked
                                ? Math.max((comment.dislikesCount || 1) - 1, 0)
                                : comment.dislikesCount
                        }
                        : comment
                )
            );
        } catch (error) {
            console.error(error);
        }
    }, []);

    const handleDislikeComment = useCallback(async (commentId) => {
        try {
            const res = await dislikeCommentApi(commentId);
            const { dislikesCount, isDisliked } = res.data;
            setComments(prev =>
                prev.map(comment =>
                    comment._id === commentId
                        ? {
                            ...comment,
                            dislikesCount,
                            isDisliked,
                            isLiked: isDisliked ? false : comment.isLiked,
                            likesCount: isDisliked && comment.isLiked
                                ? Math.max((comment.likesCount || 1) - 1, 0)
                                : comment.likesCount
                        }
                        : comment
                )
            );
        } catch (error) {
            console.error(error);
        }
    }, []);

    return (
        <div className="mt-6 w-full pb-8">
            <h2 className="font-bold text-lg mb-6">{comments.length} Comments</h2>

            {/* Add Comment Input */}
            <div className="flex gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex-shrink-0 flex items-center justify-center font-bold overflow-hidden mt-1">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <UserCircle size={24} />}
                </div>

                <div className="flex flex-col w-full">
                    <input
                        className="w-full border-b border-gray-300 focus:border-black outline-none bg-transparent py-1 transition-colors text-sm"
                        type="text"
                        value={newComment}
                        onChange={e => {
                            setNewComment(e.target.value);
                            setShowCommentButtons(true);
                        }}
                        onFocus={() => setShowCommentButtons(true)}
                        placeholder="Add a comment..."
                    />

                    {showCommentButtons && (
                        <div className="flex justify-end gap-2 mt-2">
                            <button
                                className="px-4 py-2 hover:bg-gray-100 rounded-full text-sm font-medium transition-colors"
                                onClick={() => {
                                    setNewComment('');
                                    setShowCommentButtons(false);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${newComment.trim()
                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    }`}
                                onClick={handleAddComment}
                                disabled={!newComment.trim()}
                            >
                                Comment
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Comments List */}
            <div className="flex flex-col gap-6">
                {comments.map(comment => (
                    <div key={comment._id} className="flex gap-4 group">
                        {/* User Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gray-600 text-white flex-shrink-0 flex items-center justify-center font-bold mt-1">
                            {comment.user_id?.name ? comment.user_id.name.charAt(0).toUpperCase() : "U"}
                        </div>

                        {/* Comment Content */}
                        <div className="flex flex-col w-full">
                            <div className="flex items-center gap-1.5 mb-1">
                                <span className="font-semibold text-[13px] text-gray-900">
                                    @{comment.user_id?.name?.replace(/\s+/g, '').toLowerCase() || "user"}
                                </span>
                                <span className="text-[12px] text-gray-500">1 day ago</span>
                            </div>

                            {editingId === comment._id ? (
                                <div className="flex flex-col gap-2 mt-1">
                                    <input
                                        className="w-full border-b border-black focus:border-black outline-none bg-transparent py-1 text-[14px]"
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        autoFocus
                                    />
                                    <div className="flex gap-2 justify-end">
                                        <button
                                            className="px-3 py-1.5 bg-gray-100 rounded-full hover:bg-gray-200 text-sm font-medium"
                                            onClick={() => {
                                                setEditingId(null);
                                                setEditText("");
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="px-3 py-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 text-sm font-medium"
                                            onClick={() => handleUpdateComment(comment._id)}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="text-[14px] text-gray-900 whitespace-pre-wrap">{comment.commentText}</p>

                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center">
                                            <button
                                                className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors ${comment.isLiked ? "text-black" : "text-gray-600"}`}
                                                onClick={() => handleLikeComment(comment._id)}
                                            >
                                                <ThumbsUp size={16} className={comment.isLiked ? "fill-black text-black" : ""} />
                                            </button>
                                            <span className="text-xs text-gray-600 ml-1">{comment.likesCount || ""}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <button
                                                className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors ${comment.isDisliked ? "text-black" : "text-gray-600"}`}
                                                onClick={() => handleDislikeComment(comment._id)}
                                            >
                                                <ThumbsDown size={16} className={comment.isDisliked ? "fill-black text-black" : ""} />
                                            </button>
                                        </div>
                                        <button className="text-[12px] font-medium text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded-full transition-colors">
                                            Reply
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Dropdown Options (Edit/Delete) */}
                        {comment.user_id?._id === user?.id && editingId !== comment._id && (
                            <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1 hover:bg-gray-100 rounded-full" onClick={() => handleEditClick(comment)}>
                                    <MoreVertical size={16} className="text-gray-700" />
                                </button>
                                {/* We can use a simpler edit/delete array for Youtube like context menu, but for simplicity showing small text links on hover could work, or we just put the buttons visibly when hovering. */}
                                <div className="absolute right-0 mt-1 flex flex-col bg-white shadow-md border rounded min-w-[100px] z-10 p-1 opacity-0 group-hover:opacity-100">
                                    <button
                                        className="text-left px-3 py-2 text-sm hover:bg-gray-100 w-full"
                                        onClick={() => handleEditClick(comment)}
                                    >Edit</button>
                                    <button
                                        className="text-left px-3 py-2 text-sm hover:bg-gray-100 w-full text-red-600"
                                        onClick={() => handleDelete(comment._id)}
                                    >Delete</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentSection;
