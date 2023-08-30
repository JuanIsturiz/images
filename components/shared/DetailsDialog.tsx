import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { Heart } from "lucide-react";
import NewCommentWizard from "./NewCommentWizard";
import CommentList from "./CommentList";

const DetailsDialog: React.FC<{
  onLike: () => void;
  isLiked: boolean;
  closeDialog: () => void;
  isOpen: boolean;
  image: Image;
  userId: string;
}> = ({ closeDialog, isOpen, image, onLike, isLiked, userId }) => {
  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="p-3 sm:max-w-4xl">
        <div className="flex flex-col gap-2 md:gap-3 md:flex-row">
          <div className="flex-1">
            <DialogHeader className="mb-2">
              <DialogTitle className="font-medium">
                <div className="flex items-center gap-2">
                  <Image
                    src={image.author.image}
                    alt={"Profile Picture"}
                    width={26}
                    height={26}
                    className="rounded-full"
                  />
                  <Link href={`/profile/${image.author.id}`}>
                    <p className="hover:underline">{image.author.username}</p>
                  </Link>
                </div>
              </DialogTitle>
            </DialogHeader>
            <Image
              className="mx-auto rounded-sm mb-1"
              src={image.imageUrl}
              alt={image.title}
              width={420}
              height={420}
            />
            <div className="flex items-center gap-2 py-0.5">
              <Heart
                className={`cursor-pointer transition-colors duration-100 ${
                  isLiked
                    ? " text-red-600 hover:text-zinc-500"
                    : "hover:text-red-600"
                }`}
                onClick={onLike}
              />
              <p>
                {image.likedBy.length === 1
                  ? `${image.likedBy.length} Like`
                  : `${image.likedBy.length} Likes`}
              </p>
            </div>
            <Separator className="my-1" />
            <p className="ml-1 text-lg dark:text-zinc-300">{image.title}</p>
          </div>
          <div className="flex-1">
            <h4 className="mt-8 mb-2 text-lg">Comments</h4>
            {userId && (
              <NewCommentWizard
                userId={userId}
                imageId={image._id}
                imageOwner={image.author._id}
              />
            )}
            <CommentList comments={image.comments} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailsDialog;
