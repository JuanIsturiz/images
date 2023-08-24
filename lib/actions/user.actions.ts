"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "../db";
import User from "../models/user.model";
import Image from "../models/image.model";

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

// export async function getActivity(userId: string, following: string[]) {
//   try {
//     connectDB();

//     const images = await Image.find({
//       author: {
//         $in: following
//       }
//     }).populate({
//       path: 'User',
//       model: User,
//       select: 'id username image'
//     })

//     // const usersFollowed = await User.find({
//     //   followed: { $in: [userId] },
//     // }).populate({ path: "Image", model: Image });

//     // const images = usersFollowed.map((user: any) => user.images);

//     return [];
//   } catch (error: any) {
//     throw new Error(`Failed to get activities: ${error.message}`);
//   }
// }
