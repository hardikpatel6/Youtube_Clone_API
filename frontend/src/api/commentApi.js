import API from "./axios";

export const getCommentsApi = (videoId) =>
  API.get(`/comments/allComments/${videoId}`);

export const addCommentApi = (videoId, commentText) =>
  API.post(`/comments/comment/${videoId}`, { commentText });

export const updateCommentApi = (commentId, commentText) =>
  API.put(`/comments/edit/${commentId}`, { commentText });

export const deleteCommentApi = (commentId) =>
  API.delete(`/comments/comment/${commentId}`);

export const likeCommentApi = (commentId) =>
  API.post(`/comments/like/${commentId}`);

export const dislikeCommentApi = (commentId) =>
  API.post(`/comments/dislike/${commentId}`);