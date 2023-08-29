"use server";

import { connectDB } from "../db";
import Activity from "../models/activity.model";

interface CreateActivityParams {
  type: string;
  fromUser: string;
  toUser: string;
  image?: string;
  comment?: string;
}

export default async function createActivity({
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
