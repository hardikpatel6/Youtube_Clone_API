import type { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import { Types } from "mongoose";
import Comment from "../models/commentModel";
import { AuthenticatedRequest } from "./videoContoller";
import Video from "../models/videoModel";
import mongoose from "mongoose";

export const addComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { videoId } = req.params;
    const { commentText } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Invalid video ID" });
    }

    const videoExists = await Video.findById(videoId);
    if (!videoExists) return res.status(404).json({ message: "Video not found" });

    const comment = await Comment.create({
      _id: new mongoose.Types.ObjectId(),
      video_id: videoId,
      user_id: userId,
      commentText,
    });

    res.status(201).json({ message: "Comment added successfully", comment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------ EDIT COMMENT ------------------
export const editComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { commentId } = req.params; // comment ID
    const userId = req.user?._id;
    const userRole = req.user?.role;
    const { commentText } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only the comment owner or admin can edit
    if (comment.user_id.toString() !== userId.toString() && userRole !== "admin") {
      return res.status(403).json({ message: "You are not allowed to edit this comment" });
    }

    // Update comment text
    comment.commentText = commentText;
    await comment.save();

    res.status(200).json({
      message: "Comment updated successfully",
      comment,
    });
  } catch (error) {
    console.error("Error editing comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------ GET COMMENTS BY VIDEO ------------------
export const getCommentsByVideo = async (req: Request, res: Response) => {
  try {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Invalid video ID" });
    }

    const comments = await Comment.find({ video_id: videoId })
      .populate("user_id", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------ DELETE COMMENT ------------------
export const deleteComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { commentId } = req.params;
    const userId = req.user?._id;
    const userRole = req.user?.role;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Only comment owner or admin can delete
    if (comment.user_id.toString() !== userId?.toString() && userRole !== "admin") {
      return res.status(403).json({ message: "You are not authorized to delete The Video" });
    }

    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const likeComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params; // comment ID
    const userId = req.user?._id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Convert ObjectIds to strings for comparison
    const likedBy = comment.likedBy?.map(id => id.toString()) || [];

    const isLiked = likedBy.includes(userId.toString());

    if (isLiked) {
      const updatedComment = await Comment.findByIdAndUpdate(
        id,
        { $pull: { likedBy: userId } },
        { new: true }
      );

      return res.json({
        message: "Like removed",
        likesCount: updatedComment?.likedBy?.length ?? 0,
        isLiked: false
      });
    }
    // Remove dislike if present, then add like
    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      {
        $pull: { dislikedBy: userId },
        $addToSet: { likedBy: userId }
      },
      { new: true }
    );

    res.json({
      message: "Comment liked successfully",
      likesCount: updatedComment?.likedBy?.length ?? 0,
      isLiked: true
    });
  } catch (error) {
    console.error("Error liking comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const dislikeComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const dislikedBy = comment.dislikedBy?.map(id => id.toString()) || [];
    const isDisliked = dislikedBy.includes(userId.toString());

    // If already disliked, remove dislike
     if (isDisliked) {
      const updatedComment = await Comment.findByIdAndUpdate(
        id,
        { $pull: { dislikedBy: userId } },
        { new: true }
      );
      return res.json({
        message: "Dislike removed",
        dislikesCount: updatedComment?.dislikedBy?.length ?? 0,
        isDisliked: false
      });
    }
    // ADD DISLIKE (toggle on)
    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      {
        $pull: { likedBy: userId },      // remove like if exists
        $addToSet: { dislikedBy: userId } // add dislike
      },
      { new: true }
    );
    res.json({
      message: "Comment disliked successfully",
      dislikesCount: updatedComment?.dislikedBy?.length ?? 0,
      isDisliked: true
    });
  } catch (error) {
    console.error("Error disliking comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};



