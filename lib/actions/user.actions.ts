import { connectDB } from "../db";

export async function getUser(id: string) {
  try {
    if (!id) return null;
    connectDB();
    console.log({ id });
    return null;
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
}: UpdateUserParams) {}
