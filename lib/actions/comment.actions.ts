"use server";

import { revalidatePath } from "next/cache";
import Comment from "../models/comment.model";
import Image from "../models/image.model";
import { connectDB } from "../db";

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
  image: string;
  content: string;
  path: string;
}

export async function createComment({
  author,
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
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create comment: ${error.message}`);
  }
}

export async function deleteComment({
  imageId,
  commentId,
  path,
}: {
  imageId: string;
  commentId: string;
  path: string;
}) {
  try {
    connectDB();
    await Image.findByIdAndUpdate(imageId, {
      $pull: {
        comments: commentId,
      },
    });

    await Comment.findByIdAndDelete(commentId);

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete comment: ${error.message}`);
  }
}
