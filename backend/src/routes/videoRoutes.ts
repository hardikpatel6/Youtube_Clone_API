import express from "express";
import {uploadVideoFile,showAllVideos,searchVideos,getVideoById,editVideo,likeVideo,dislikeVideo,deleteVideo,subscribeVideo,unsubscribeVideo, incrementViewCount} from "../controllers/videoContoller";
import {auth} from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/upload-video",auth,uploadVideoFile);
router.get("/",auth,showAllVideos);
router.get("/search",auth,searchVideos);
router.get("/:id",auth,getVideoById);
router.put("/edit/:id",auth,editVideo);
router.post("/like/:id",auth,likeVideo);
router.post("/dislike/:id",auth,dislikeVideo);
router.post("/addview/:videoId",auth,incrementViewCount);
router.delete("/delete/:id",auth,deleteVideo);
router.post("/subscribe/:id",auth,subscribeVideo);
router.post("/unsubscribe/:id",auth,unsubscribeVideo);

export default router;