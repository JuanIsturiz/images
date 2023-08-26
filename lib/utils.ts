import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

export function parseJson(obj: {}) {
  return JSON.parse(JSON.stringify(obj));
}

export function validateImage(img: any) {
  return {
    _id: parseJson(img._id),
    author: {
      _id: parseJson(img.author._id),
      id: img.author.id,
      username: img.author.username,
      image: img.author.image,
    },
    imageUrl: img.imageUrl,
    title: img.title,
    createdAt: img.createdAt,
    likedBy: img.likedBy.map(parseJson),
  };
}

export function validateFollowUser(followUser: any) {
  return {
    _id: parseJson(followUser._id),
    id: followUser.id,
    username: followUser.username,
    image: followUser.image,
  };
}
