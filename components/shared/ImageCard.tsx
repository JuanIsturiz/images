import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { GripHorizontal, Heart, Info, Share, Trash } from "lucide-react";

interface ImageCardProps {
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

const ImageCard: React.FC<ImageCardProps> = ({
  image,
  userId,
  pathname,
  onLike,
}) => {
  const isLiked = image.likedBy.some((id) => id === userId);

  return (
    <div
      key={image._id}
      className="relative p-2 overflow-hidden rounded shadow-lg bg-zinc-100 dark:bg-zinc-900"
    >
      <div className="flex items-center justify-between mb-2">
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
            >
              <GripHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="flex gap-2 items-center">
              <Info />
              <span>View Details</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex gap-2 items-center">
              <Share />
              <span>Share</span>
            </DropdownMenuItem>
            {image.author._id === userId && (
              <DropdownMenuItem className="flex gap-2 items-center">
                <Trash />
                <span>Delete</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Image src={image.imageUrl} alt={image.title} width={224} height={224} />
      <div className="cursor-pointer absolute z-10 bottom-3 right-3 p-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900">
        {isLiked ? (
          <Heart
            className="transition-colors duration-100 text-red-600 hover:text-zinc-500"
            onClick={() => void onLike(isLiked, image._id, userId, pathname)}
          />
        ) : (
          <Heart
            className="transition-colors duration-100 hover:text-red-600"
            onClick={() => void onLike(isLiked, image._id, userId, pathname)}
          />
        )}
      </div>
    </div>
  );
};

export default ImageCard;
