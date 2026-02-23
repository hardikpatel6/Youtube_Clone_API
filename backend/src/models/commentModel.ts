import mongoose, { Schema, model, Types } from "mongoose";

export interface IComment {
    _id: string;
    video_id: Types.ObjectId;
    user_id: Types.ObjectId;
    commentText: string;
    like?: number;
    dislike?: number;
    likedBy?: Types.ObjectId[]; // array of user _id who liked the video
    dislikedBy?: Types.ObjectId[];
}

const commentSchema = new Schema<IComment>({
    _id: mongoose.Schema.Types.ObjectId,
    video_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    commentText: {
        type: String,
        required: true
    },
    likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    dislikedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

commentSchema.virtual("likesCount").get(function () {
    return this.likedBy?.length ?? 0;
});

commentSchema.virtual("dislikesCount").get(function () {
    return this.dislikedBy?.length ?? 0;
});

commentSchema.set("toJSON", { virtuals: true });
const Comment = model<IComment>('Comment', commentSchema);

export default Comment;