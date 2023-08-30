import Image from "next/image";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";

interface CommentListProps {
  comments: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  if (!comments.length)
    return (
      <div className="text-center text-lg opacity-50">
        <h3>No one has commented this image.</h3>
        <h3>Be the first one!</h3>
      </div>
    );

  return (
    <ScrollArea className="h-80">
      {[...comments, ...comments, ...comments].map((comment) => {
        return (
          <div key={comment._id} className="p-1 mb-2">
            <div className="flex items-start gap-2">
              <Image
                src={comment.author.image}
                alt={"Profile Picture"}
                width={26}
                height={26}
                className="rounded-full mt-1"
              />
              <div>
                <Link href={`/profile/${comment.author.id}`}>
                  <p className="text-sm opacity-80 hover:underline">
                    {comment.author.username}
                  </p>
                </Link>
                <p>{comment.content}</p>
              </div>
            </div>
          </div>
        );
      })}
    </ScrollArea>
  );
};

export default CommentList;
