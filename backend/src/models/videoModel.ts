import { Schema,model } from "mongoose";

import { Types } from "mongoose";

export interface IVideo {
  title: string;
  description: string;
  url: string;        // Cloudinary video URL
  thumbnail: string;  // Cloudinary thumbnail URL
  category?: string;
  tags?: string[];
  videoPublicId: string;
  thumbnailPublicId: string; 
  uploadedBy: Types.ObjectId; // user _id
  channelId?: Types.ObjectId; // channel _id
  views?: number;
  like?: number;
  dislike?: number;
  likedBy?: Types.ObjectId[]; // array of user _id who liked the video
  dislikedBy?: Types.ObjectId[]; // array of user _id who disliked the video
  viewedBy?: Types.ObjectId[]; // array of user _id who viewed the video
  subscribedBy?: Types.ObjectId[];
  unsubscribedBy?:Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}


const videoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true },
    description: { type: String },
    url: { type: String, required: true },
    thumbnail: { type: String, required: true },
    category: { type: String },
    videoPublicId: { type: String, required: true },
    thumbnailPublicId: { type: String },
    tags: { type: [String] },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    channelId: { type: Schema.Types.ObjectId, ref: "Channel" },
    likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    dislikedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    viewedBy: [{ type: Schema.Types.ObjectId, ref: "User" , default: [] }],
    subscribedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    unsubscribedBy: [{ type: Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

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
const Video = model<IVideo> ('Video', videoSchema);

export default Video;