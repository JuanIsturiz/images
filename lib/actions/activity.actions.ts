"use server";

import { connectDB } from "../db";
import Activity from "../models/activity.model";
import Comment from "../models/comment.model";
import Image from "../models/image.model";
import User from "../models/user.model";

export async function getActivity(userId: string) {
  try {
    connectDB();

    return await Activity.find({
      toUser: {
        $in: userId,
      },
    })
      .populate({
        path: "fromUser",
        model: User,
        select: "id username image",
      })
      .populate({
        path: "image",
        model: Image,
        populate: [
          { path: "author", model: User },
          {
            path: "comments",
            model: Comment,
            populate: { path: "author", model: User },
          },
        ],
      })
      .populate({
        path: "comment",
        model: Comment,
      });
  } catch (error: any) {
    throw new Error(`Failed to get activity: ${error.message}`);
  }
}

interface CreateActivityParams {
  type: string;
  fromUser: string;
  toUser: string[];
  image?: string;
  comment?: string;
}

export async function createActivity({
  type,
  fromUser,
  toUser,
  comment,
  image,
}: CreateActivityParams) {
  try {
    connectDB();

    await Activity.create({
      type,
      fromUser,
      toUser,
      comment,
      image,
    });
  } catch (error: any) {
    throw new Error(`Failed to create activity: ${error.message}`);
  }
}

interface DeleteActivityParams {
  type: string;
  fromUser?: string;
  toUser?: string;
  image?: string;
  comment?: string;
}

export async function deleteActivity({
  type,
  fromUser,
  toUser,
  image,
  comment,
}: DeleteActivityParams) {
  try {
    connectDB();

    await Activity.deleteOne({
      type,
      fromUser,
      image,
      comment,
      toUser: {
        $in: toUser,
      },
    });
  } catch (error: any) {
    throw new Error(`Failed to delete activity: ${error.message}`);
  }
}
