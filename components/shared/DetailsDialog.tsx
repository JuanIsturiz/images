import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { Heart } from "lucide-react";

function likeFormater(ammount: number) {
  if (ammount === 1) {
    return `${ammount} Like`;
  } else {
    return `${ammount} Likes`;
  }
}

const DetailsDialog: React.FC<{
  onLike: () => void;
  isLiked: boolean;
  closeDialog: () => void;
  isOpen: boolean;
  image: Image;
}> = ({ closeDialog, isOpen, image, onLike, isLiked }) => {
  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="p-3 sm:max-w-[440px]">
        <DialogHeader>
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
          className="mx-auto rounded-sm"
          src={image.imageUrl}
          alt={image.title}
          width={420}
          height={420}
        />
        <div className="flex items-center gap-2">
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
        <Separator />
        <p className="ml-1 -mt-2 dark:text-zinc-300">{image.title}</p>
      </DialogContent>
    </Dialog>
  );
};

export default DetailsDialog;
