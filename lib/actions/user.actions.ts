"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "../db";
import User from "../models/user.model";
import { FilterQuery } from "mongoose";
import { createActivity, deleteActivity } from "./activity.actions";
import { validateFollowUser } from "../utils";

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
      // update follower
      await User.findByIdAndUpdate(userId, {
        $push: {
          following: otherUserId,
        },
      });
      // update followed
      await User.findByIdAndUpdate(otherUserId, {
        $push: {
          followers: userId,
        },
      });
      // create follow activity
      await createActivity({
        type: "follow",
        fromUser: userId,
        toUser: [otherUserId],
      });
    } else {
      // update follower
      await User.findByIdAndUpdate(userId, {
        $pull: {
          following: otherUserId,
        },
      });
      // update followed
      await User.findByIdAndUpdate(otherUserId, {
        $pull: {
          followers: userId,
        },
      });
      // delete follow activity
      await deleteActivity({
        type: "follow",
        fromUser: userId,
        toUser: otherUserId,
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
      followers: user.followers.map(validateFollowUser),
      following: user.following.map(validateFollowUser),
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
  pageNumber = 1,
  pageSize = 20,
}: GetUsersBySearchParams) {
  try {
    connectDB();

    const skipAmount = (pageNumber - 1) * pageSize;

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
    const users = await User.find(query).skip(skipAmount).limit(pageSize);
    const totalUsersCount = await User.countDocuments(query);
    const isNext = totalUsersCount > skipAmount + users.length;
    return { users, isNext };
  } catch (error: any) {
    throw new Error(`Failed to search: ${error.message}`);
  }
}
