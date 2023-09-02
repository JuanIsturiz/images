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
  activity: Activity;
  onLike: (
    isLiked: boolean,
    imageId: string,
    userId: string | null,
    author: string,
    path: string
  ) => void;
}

dayjs.extend(relativeTime);

const ActivityCard: React.FC<ActivityCardProps> = ({
  pathname,
  userId,
  activity,
  onLike,
}) => {
  const isLiked = activity.image?.likedBy.some((id) => id === userId) ?? false;
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="h-28 max-w-3xl flex justify-between mx-auto mb-2 p-2 shadow-lg border dark:border-zinc-950 rounded">
        <div>
          <div className="flex gap-1.5 items-center hover:underline">
            <Image
              src={activity.fromUser.image}
              alt="User Profile Picture"
              width={28}
              height={28}
              className="rounded-full"
            />
            <p className="text-lg">
              <Link href={`/profile/${activity.fromUser.id}`}>
                {activity.fromUser.username}
              </Link>
            </p>
          </div>
          <div className="text-lg ml-2 mt-2">
            <p>
              {activity.type === "like" && "Liked your image "}
              {activity.type === "post" && "Posted an image "}
              {activity.type === "comment" && "Commented your image "}
              {activity.type === "follow" && "Followed you "}
              <span className="text-lg opacity-80 dark:opacity-60">
                {dayjs(activity.createdAt).fromNow()}.
              </span>
            </p>
            {activity.type === "comment" && (
              <p className="text-md opacity-80">
                "{activity.comment?.content}"
              </p>
            )}
          </div>
        </div>
        <div
          className="rounded overflow-hidden"
          onClick={() => setIsOpen(true)}
        >
          {activity.image && (
            <Image
              src={activity.image.imageUrl}
              alt={activity.image.title}
              width={96}
              height={96}
              className="cursor-pointer rounded hover:scale-105 transition-transform duration-150"
            />
          )}
        </div>
      </div>
      {activity.image && (
        <DetailsDialog
          isOpen={isOpen}
          image={activity.image}
          closeDialog={() => setIsOpen(false)}
          onLike={() =>
            void onLike(
              isLiked,
              activity.image?._id ?? "",
              userId,
              activity.image?.author._id ?? "",
              pathname
            )
          }
          isLiked={isLiked}
          userId={userId ?? ""}
        />
      )}
    </>
  );
};

export default ActivityCard;
