"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const commentController_1 = require("../controllers/commentController");
const router = express_1.default.Router();
router.post("/comment/:videoId", authMiddleware_1.auth, commentController_1.addComment);
router.put("/edit/:commentId", authMiddleware_1.auth, commentController_1.editComment);
router.get("/allComments/:videoId", authMiddleware_1.auth, commentController_1.getCommentsByVideo);
router.delete("/comment/:commentId", authMiddleware_1.auth, commentController_1.deleteComment);
router.post("/like/:id", authMiddleware_1.auth, commentController_1.likeComment);
router.post("/dislike/:id", authMiddleware_1.auth, commentController_1.dislikeComment);
exports.default = router;
