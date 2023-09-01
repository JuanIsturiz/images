"use client";

import Image from "next/image";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { deleteComment } from "@/lib/actions/comment.actions";
import { usePathname } from "next/navigation";

interface CommentListProps {
  comments: Comment[];
  userId: string;
  imageId: string;
  imageOwner: string;
}

dayjs.extend(relativeTime);

const CommentList: React.FC<CommentListProps> = ({
  comments,
  userId,
  imageId,
  imageOwner,
}) => {
  const pathname = usePathname();

  if (!comments.length)
    return (
      <div className="text-center text-lg opacity-50">
        <h3>No one has commented this image.</h3>
        <h3>Be the first one!</h3>
      </div>
    );

  async function handleDelete(
    userId: string,
    imageId: string,
    commentId: string,
    path: string
  ) {
    await deleteComment({ commentId, imageId, userId, path });
  }

  return (
    <ScrollArea className="h-80">
      {comments.map((comment) => {
        return (
          <div key={comment._id} className="p-1 mb-2">
            <div className="relative flex justify-between items-center gap-2">
              <div className="flex items-start gap-2">
                <Image
                  src={comment.author.image}
                  alt={"Profile Picture"}
                  width={26}
                  height={26}
                  className="rounded-full mt-1"
                />
                <div>
                  <div>
                    <Link href={`/profile/${comment.author.id}`}>
                      <p className="inline text-sm opacity-80 hover:underline">
                        {comment.author.username}
                      </p>
                    </Link>{" "}
                    <span className="inline text-sm opacity-60">
                      {dayjs(comment.createdAt).fromNow()}.
                    </span>
                  </div>
                  <p>{comment.content}</p>
                </div>
              </div>
              {(imageOwner === userId || userId === comment.author._id) && (
                <Button
                  size={"sm"}
                  className="p-1 h-auto"
                  onClick={() =>
                    void handleDelete(userId, imageId, comment._id, pathname)
                  }
                >
                  <Trash size={18} />
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </ScrollArea>
  );
};

export default CommentList;
