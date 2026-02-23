"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const videoSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String },
    url: { type: String, required: true },
    thumbnail: { type: String, required: true },
    category: { type: String },
    videoPublicId: { type: String, required: true },
    thumbnailPublicId: { type: String },
    tags: { type: [String] },
    uploadedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    channelId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Channel" },
    likedBy: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    dislikedBy: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    viewedBy: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User", default: [] }],
    subscribedBy: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    unsubscribedBy: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });
videoSchema.virtual("likes").get(function () {
    return this.likedBy ? this.likedBy.length : 0;
});
videoSchema.virtual("dislikes").get(function () {
    return this.dislikedBy ? this.dislikedBy.length : 0;
});
videoSchema.virtual("views").get(function () {
    return this.viewedBy ? this.viewedBy.length : 0;
});
videoSchema.virtual("subscribersCount").get(function () {
    return this.subscribedBy?.length || 0;
});
videoSchema.virtual("unsubscribersCount").get(function () {
    return this.unsubscribedBy?.length || 0;
});
videoSchema.set("toJSON", { virtuals: true });
const Video = (0, mongoose_1.model)('Video', videoSchema);
exports.default = Video;
