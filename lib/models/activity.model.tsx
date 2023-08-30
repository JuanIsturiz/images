import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  toUser: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: Date.now,
    index: {
      expires: "7d",
    },
  },
});

const Activity =
  mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);

export default Activity;
