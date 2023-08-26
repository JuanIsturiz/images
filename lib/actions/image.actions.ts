"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "../db";
import Image from "../models/image.model";
import User from "../models/user.model";
import { utapi } from "uploadthing/server";

interface CreateImageParams {
  author: string;
  imageUrl: string;
  title: string;
  path: string;
}

export async function createImage({
  author,
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

    // Update user model
    await User.findByIdAndUpdate(author, {
      $push: { images: image._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create image: ${error.message}`);
  }
}

// const skipAmount = (pageNumber - 1) * pageSize;

// // fetch the posts that have no parents (top-level threads...)
// const postsQuery = Thread.find({
//   parentId: {
//     $in: [null, undefined],
//   },
// })
//   .sort({ createdAt: "desc" })
//   .skip(skipAmount)
//   .limit(pageSize)
//   .populate({ path: "author", model: User })
//   .populate({
//     path: "children",
//     populate: {
//       path: "author",
//       model: User,
//       select: "_id name parentId image",
//     },
//   });

// const totalPostsCount = await Thread.countDocuments({
//   parentId: {
//     $in: [null, undefined],
//   },
// });

// const posts = await postsQuery.exec();

// const isNext = totalPostsCount > skipAmount + posts.length;

// return { posts, isNext };

export async function getImages() {
  try {
    connectDB();
    const images = await Image.find()
      .sort({
        createdAt: "desc",
      })
      .populate({ path: "author", model: User, select: "id image username" });
    return images;
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
      .populate({ path: "author", model: User, select: "id image username" });
    return images;
  } catch (error: any) {
    throw new Error(`Failed to fetch images: ${error.message}`);
  }
}

export async function favImage(
  isLiked: boolean,
  imageId: string,
  userId: string,
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
    } else {
      await Image.findByIdAndUpdate(imageId, {
        $pull: {
          likedBy: userId,
        },
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
      revalidatePath(path);
    }

    return res;
  } catch (error: any) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}

export async function getActivity(userId: string, following: string[]) {
  try {
    connectDB();

    const images = await Image.find({
      author: {
        $in: following,
      },
    }).populate({
      path: "author",
      model: User,
      select: "id username image",
    });

    console.log({ images });
    // const usersFollowed = await User.find({
    //   followed: { $in: [userId] },
    // }).populate({ path: "Image", model: Image });

    // const images = usersFollowed.map((user: any) => user.images);

    return [];
  } catch (error: any) {
    throw new Error(`Failed to get activities: ${error.message}`);
  }
}
