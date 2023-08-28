"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "../db";
import User from "../models/user.model";
import Image from "../models/image.model";
import { FilterQuery } from "mongoose";

export async function getUser(id: string) {
  try {
    if (!id) return null;
    connectDB();
    return await User.findOne({ id });
  } catch (error: any) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
}

interface UpdateUserParams {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: UpdateUserParams) {
  try {
    connectDB();
    await User.findOneAndUpdate(
      {
        id: userId,
      },
      {
        username: username.toLocaleLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );
    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
}

export async function followUser(
  isFollowed: boolean,
  userId: string,
  otherUserId: string,
  path: string
) {
  try {
    connectDB();

    if (!isFollowed) {
      await User.findByIdAndUpdate(userId, {
        $push: {
          following: otherUserId,
        },
      });
      await User.findByIdAndUpdate(otherUserId, {
        $push: {
          followers: userId,
        },
      });
    } else {
      await User.findByIdAndUpdate(userId, {
        $pull: {
          following: otherUserId,
        },
      });
      await User.findByIdAndUpdate(otherUserId, {
        $pull: {
          followers: userId,
        },
      });
    }
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to perform following action: ${error.message}`);
  }
}

export async function getFollow(userId: string) {
  try {
    connectDB();
    const user = await User.findById(userId)
      .populate({
        path: "followers",
        model: User,
        select: "id username image",
      })
      .populate({
        path: "following",
        model: User,
        select: "id username image",
      });

    return {
      followers: user.followers,
      following: user.following,
    };
  } catch (error: any) {
    throw new Error(`Failed to get followers and followings: ${error.message}`);
  }
}

interface GetUsersBySearchParams {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
}

export async function getUsersBySearch({
  userId,
  searchString = "",
}: GetUsersBySearchParams) {
  try {
    connectDB();

    const regex = new RegExp(searchString, "i");

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }, // Exclude the current user from the results.
    };

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    return await User.find(query);
  } catch (error: any) {
    throw new Error(`Failed to search: ${error.message}`);
  }
}
