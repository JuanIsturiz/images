"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "../db";
import User from "../models/user.model";

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
          followers: otherUserId,
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
          followers: otherUserId,
        },
      });
    }
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to perform following action: ${error.message}`);
  }
}
