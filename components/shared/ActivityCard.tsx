"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";
import DetailsDialog from "./DetailsDialog";
import { useState } from "react";

interface ActivityCardProps {
  pathname: string;
  userId: string | null;
  image: Image;
  onLike: (
    isLiked: boolean,
    imageId: string,
    userId: string | null,
    path: string
  ) => void;
}

dayjs.extend(relativeTime);

const ActivityCard: React.FC<ActivityCardProps> = ({
  pathname,
  userId,
  image,
  onLike,
}) => {
  const isLiked = image.likedBy.some((id) => id === userId);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="relative max-w-3xl flex justify-between items-center mx-auto mb-2 p-2 shadow-lg rounded dark:bg-zinc-900">
        <div className="absolute top-2 left-2 flex gap-1.5 items-center hover:underline">
          <Image
            src={image.author.image}
            alt="User Profile Picture"
            width={28}
            height={28}
            className="rounded-full"
          />
          <p className="text-lg">
            <Link href={`/profile/${image.author._id}`}>
              {image.author.username}
            </Link>
          </p>
        </div>
        <div>
          <p className="text-lg mt-1">
            Posted an image{" "}
            <span className="text-lg opacity-60">
              {dayjs(image.createdAt).fromNow()}.
            </span>
          </p>
        </div>
        <div
          className="rounded overflow-hidden"
          onClick={() => setIsOpen(true)}
        >
          <Image
            src={image.imageUrl}
            alt={image.title}
            width={96}
            height={96}
            className="cursor-pointer rounded hover:scale-105 transition-transform duration-150"
          />
        </div>
      </div>
      <DetailsDialog
        isOpen={isOpen}
        image={image}
        closeDialog={() => setIsOpen(false)}
        onLike={() => void onLike(isLiked, image._id, userId, pathname)}
        isLiked={isLiked}
        userId={userId ?? ""}
      />
    </>
  );
};

export default ActivityCard;
