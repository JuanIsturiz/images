"use server";

import { revalidatePath } from "next/cache";
import Comment from "../models/comment.model";
import Image from "../models/image.model";
import { connectDB } from "../db";
import User from "../models/user.model";
import { createActivity, deleteActivity } from "./activity.actions";

export async function getComments(imageId: string) {
  try {
    connectDB();
    return await Comment.find({
      image: imageId,
    });
  } catch (error: any) {
    throw new Error(`Failed to get comments: ${error.message}`);
  }
}

interface CreateCommentParams {
  author: string;
  toUser: string;
  image: string;
  content: string;
  path: string;
}

export async function createComment({
  author,
  toUser,
  image,
  content,
  path,
}: CreateCommentParams) {
  try {
    connectDB();
    const comment = await Comment.create({
      author,
      image,
      content,
    });

    await Image.findByIdAndUpdate(image, {
      $push: {
        comments: comment._id,
      },
    });

    await User.findByIdAndUpdate(author, {
      $push: {
        comments: comment._id,
      },
    });

    if (author !== toUser) {
      await createActivity({
        type: "comment",
        fromUser: author,
        toUser: [toUser],
        image,
        comment: comment._id,
      });
    }
    revalidatePath(path);

    return true;
  } catch (error: any) {
    throw new Error(`Failed to create comment: ${error.message}`);
  }
}

export async function deleteComment({
  userId,
  imageId,
  commentId,
  path,
}: {
  userId: string;
  imageId: string;
  commentId: string;
  path: string;
}) {
  try {
    connectDB();
    await Image.findByIdAndUpdate(userId, {
      $pull: {
        comments: commentId,
      },
    });

    await Image.findByIdAndUpdate(imageId, {
      $pull: {
        comments: commentId,
      },
    });

    await Comment.findByIdAndDelete(commentId);

    await deleteActivity({
      type: "comment",
      comment: commentId,
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete comment: ${error.message}`);
  }
}
