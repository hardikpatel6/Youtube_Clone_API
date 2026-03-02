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

    const [replyingToId, setReplyingToId] = useState(null);
    const [replyText, setReplyText] = useState("");

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
    }, [videoId, fetchComments]);

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

    const handleAddReply = useCallback(
        async (parentId, repliedToUserId = null, repliedToUserName = null) => {
            if (!replyText.trim()) return;
            try {
                // If we are replying to a specific sub-reply user, keep the @username in the text or handle it here
                const res = await addCommentApi(videoId, replyText, parentId);
                console.log("res", res.data);
                const newReplyObj = {
                    ...res.data.comment,
                    user_id: {
                        _id: user.id,
                        name: user.name
                    }
                };

                setComments(prev => [...prev, newReplyObj]);
                setReplyText("");
                setReplyingToId(null);
            } catch (error) {
                console.error(error);
            }
        }, [replyText, videoId, user]);

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
                    prev.filter(comment => comment._id !== commentId && comment.parentCommentId !== commentId)
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

    const renderCommentItem = (comment, level = 0) => (
        <div key={comment._id} className={`flex gap-4 group ${level > 0 ? 'mt-4' : ''}`}>
            {/* User Avatar */}
            <div className={`rounded-full bg-gray-600 text-white flex-shrink-0 flex items-center justify-center font-bold mt-1 ${level > 0 ? 'w-8 h-8 text-sm' : 'w-10 h-10'}`}>
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
                            <button
                                className="text-[12px] font-medium text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded-full transition-colors"
                                onClick={() => {
                                    setReplyingToId(comment._id);
                                    // If replying to a specific sub-reply, pre-fill their username
                                    if (level > 0) {
                                        const username = comment.user_id?.name?.replace(/\s+/g, '').toLowerCase() || "user";
                                        setReplyText(`@${username} `);
                                    } else {
                                        setReplyText("");
                                    }
                                }}
                            >
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
    );

    const renderCommentNode = (topLevelComment) => {
        // Find all replies that belong to this top-level comment's thread.
        // In a true YouTube clone, we'd recursively gather ALL descendants, or the backend would just return 
        // a `topLevelCommentId` for every reply. Since our schema only has `parentCommentId`, 
        // we'll recursively find all descendants to display them flatly.

        const getDescendants = (parentId) => {
            const directChildren = comments.filter(c => c.parentCommentId === parentId);
            let all = [...directChildren];
            for (const child of directChildren) {
                all = [...all, ...getDescendants(child._id)];
            }
            return all;
        };

        // All replies in this thread, sorted chronologically (assuming API returned them in order, or we can sort by date)
        const threadReplies = getDescendants(topLevelComment._id).sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));

        return (
            <div key={`thread-${topLevelComment._id}`} className="flex flex-col">
                {/* 1. Render the main top-level comment */}
                {renderCommentItem(topLevelComment, 0)}

                {/* 2. Render all replies in a flat list right below it, with a single indent */}
                {(threadReplies.length > 0 || replyingToId === topLevelComment._id || threadReplies.some(r => replyingToId === r._id)) && (
                    <div className="ml-14 mt-2 flex flex-col">

                        {threadReplies.map(reply => (
                            <div key={`reply-wrapper-${reply._id}`}>
                                {renderCommentItem(reply, 1)}

                                {/* If replying to this specific sub-reply, show input right under it */}
                                {replyingToId === reply._id && (
                                    <div className="flex gap-4 mt-3 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex-shrink-0 flex items-center justify-center font-bold mt-1 text-xs">
                                            {user?.name ? user.name.charAt(0).toUpperCase() : <UserCircle size={16} />}
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <input
                                                className="w-full border-b border-gray-300 focus:border-black outline-none bg-transparent py-1 transition-colors text-sm"
                                                type="text"
                                                value={replyText}
                                                onChange={e => setReplyText(e.target.value)}
                                                placeholder="Add a reply..."
                                                autoFocus
                                            />
                                            <div className="flex justify-end gap-2 mt-2">
                                                <button
                                                    className="px-4 py-1.5 hover:bg-gray-100 rounded-full text-xs font-medium transition-colors"
                                                    onClick={() => {
                                                        setReplyingToId(null);
                                                        setReplyText('');
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${replyText.trim()
                                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                        }`}
                                                    onClick={() => handleAddReply(topLevelComment._id)}
                                                    disabled={!replyText.trim()}
                                                >
                                                    Reply
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* If replying directly to the top-level comment, show input at the bottom of the thread */}
                        {replyingToId === topLevelComment._id && (
                            <div className="flex gap-4 mt-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex-shrink-0 flex items-center justify-center font-bold mt-1 text-xs">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : <UserCircle size={16} />}
                                </div>
                                <div className="flex flex-col w-full">
                                    <input
                                        className="w-full border-b border-gray-300 focus:border-black outline-none bg-transparent py-1 transition-colors text-sm"
                                        type="text"
                                        value={replyText}
                                        onChange={e => setReplyText(e.target.value)}
                                        placeholder="Add a reply..."
                                        autoFocus
                                    />
                                    <div className="flex justify-end gap-2 mt-2">
                                        <button
                                            className="px-4 py-1.5 hover:bg-gray-100 rounded-full text-xs font-medium transition-colors"
                                            onClick={() => {
                                                setReplyingToId(null);
                                                setReplyText('');
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${replyText.trim()
                                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                }`}
                                            onClick={() => handleAddReply(topLevelComment._id)}
                                            disabled={!replyText.trim()}
                                        >
                                            Reply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const topLevelComments = comments.filter(c => !c.parentCommentId);

    return (
        <div className="mt-6 w-full pb-8">
            <h2 className="font-bold text-lg mb-6">{topLevelComments.length} Comments</h2>

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
                {topLevelComments.map(comment => renderCommentNode(comment))}
            </div>
        </div>
    );
};

export default CommentSection;
