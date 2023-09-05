"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "../db";
import Image from "../models/image.model";
import User from "../models/user.model";
import { utapi } from "uploadthing/server";
import { createActivity, deleteActivity } from "./activity.actions";
import Comment from "../models/comment.model";
import { validateImage } from "../utils";

interface CreateImageParams {
  author: string;
  followers: string[];
  imageUrl: string;
  title: string;
  path: string;
}

export async function createImage({
  author,
  followers,
  imageUrl,
  title,
  path,
}: CreateImageParams) {
  try {
    connectDB();
    const image = await Image.create({
      author,
      imageUrl,
      title,
    });

    await User.findByIdAndUpdate(author, {
      $push: { images: image._id },
    });

    await createActivity({
      type: "post",
      fromUser: author,
      toUser: followers,
      image: image._id,
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create image: ${error.message}`);
  }
}

export async function getImages(page: number, pageSize: number) {
  try {
    connectDB();
    const skipAmount = (page - 1) * pageSize;

    const images = await Image.find()
      .sort({
        createdAt: "desc",
      })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "author", model: User, select: "id image username" })
      .populate({
        path: "comments",
        model: Comment,
        populate: {
          path: "author",
          model: User,
          select: "id image username",
        },
      });

    const totalImageCount = await Image.countDocuments();

    const isNext = totalImageCount > skipAmount + images.length;

    return { data: images.map(validateImage), isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch images: ${error.message}`);
  }
}

export async function getUserImagesById(userId: string) {
  try {
    connectDB();
    const images = await Image.find({
      author: userId,
    })
      .sort({
        createdAt: "desc",
      })
      .populate({ path: "author", model: User, select: "id image username" })
      .populate({
        path: "comments",
        model: Comment,
        populate: {
          path: "author",
          model: User,
          select: "id image username",
        },
      });
    return images.map(validateImage);
  } catch (error: any) {
    throw new Error(`Failed to fetch images: ${error.message}`);
  }
}

export async function favImage(
  isLiked: boolean,
  imageId: string,
  userId: string,
  author: string,
  path: string
) {
  try {
    connectDB();
    if (!isLiked) {
      await Image.findByIdAndUpdate(imageId, {
        $push: {
          likedBy: userId,
        },
      });
      await createActivity({
        type: "like",
        fromUser: userId,
        toUser: [author],
        image: imageId,
      });
    } else {
      await Image.findByIdAndUpdate(imageId, {
        $pull: {
          likedBy: userId,
        },
      });
      await deleteActivity({
        type: "like",
        fromUser: userId,
        toUser: author,
        image: imageId,
      });
    }
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to like image: ${error.message}`);
  }
}

export async function deleteImage(
  userId: string,
  imageId: string,
  url: string,
  path: string
) {
  try {
    connectDB();
    const key = url.split("f/")[1];
    const res = await utapi.deleteFiles(key);

    if (res.success) {
      await User.findByIdAndUpdate(userId, {
        $pull: {
          images: imageId,
        },
      });
      await Image.findByIdAndDelete(imageId);

      await deleteActivity({
        type: "post",
        image: imageId,
      });
      revalidatePath(path);
    }

    return res;
  } catch (error: any) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}
