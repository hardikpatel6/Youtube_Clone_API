import express from "express";
import {auth} from "../middlewares/authMiddleware";
import { addComment,editComment,getCommentsByVideo,deleteComment,likeComment,dislikeComment } from "../controllers/commentController";

const router = express.Router();

router.post("/comment/:videoId",auth,addComment);
router.put("/edit/:commentId",auth,editComment);
router.get("/allComments/:videoId",auth,getCommentsByVideo);
router.delete("/comment/:commentId",auth,deleteComment);
router.post("/like/:id",auth,likeComment);
router.post("/dislike/:id",auth,dislikeComment)

export default router;