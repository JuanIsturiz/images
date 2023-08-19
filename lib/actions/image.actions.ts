"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "../db";
import Image from "../models/image.model";
import User from "../models/user.model";

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
