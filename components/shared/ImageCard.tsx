"use client";

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
import { useState } from "react";
import { deleteImage } from "@/lib/actions/image.actions";
import { useToast } from "../ui/use-toast";
import DetailsDialog from "./DetailsDialog";

interface ImageCardProps {
  pathname: string;
  userId: string | null;
  image: Image;
  onLike: (
    isLiked: boolean,
    imageId: string,
    userId: string | null,
    author: string,
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
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  async function handleDelete() {
    const res = await deleteImage(
      userId ?? "",
      image._id,
      image.imageUrl,
      pathname
    );

    if (!res.success) {
      toast({
        duration: 2000,
        variant: "destructive",
        description: "Failed to delete image.",
      });
    } else {
      toast({
        description: `Image: "${image.title.substring(
          0,
          5
        )}..." deleted successfully.`,
        duration: 2000,
      });
    }
  }

  return (
    <>
      <div
        key={image._id}
        className="sm:w-auto relative p-2 overflow-hidden rounded shadow-lg bg-zinc-100 dark:bg-zinc-900"
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
          <OptionMenu
            path={pathname}
            userId={userId}
            authorId={image.author._id}
            onDelete={handleDelete}
            openDialog={() => setIsOpen(true)}
          />
        </div>
        <Image
          src={image.imageUrl}
          alt={image.title}
          width={180}
          height={180}
          className="w-full sm:w-[280px] sm:h-[280px] md:w-[190px]
md:h-[190px] lg:w-[240px] lg:h-[240px]"
        />
        <div className="cursor-pointer absolute z-10 bottom-3 right-3 p-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900">
          <Heart
            className={`transition-colors duration-100 ${
              isLiked
                ? " text-red-600 hover:text-zinc-500"
                : "hover:text-red-600"
            }`}
            onClick={() =>
              void onLike(
                isLiked,
                image._id,
                userId,
                image.author._id,
                pathname
              )
            }
          />
        </div>
      </div>
      <DetailsDialog
        isOpen={isOpen}
        image={image}
        closeDialog={() => setIsOpen(false)}
        onLike={() =>
          void onLike(isLiked, image._id, userId, image.author._id, pathname)
        }
        isLiked={isLiked}
        userId={userId ?? ""}
      />
    </>
  );
};

const OptionMenu: React.FC<{
  path: string;
  authorId: string;
  userId: string | null;
  openDialog: () => void;
  onDelete: () => void;
}> = ({ path, authorId, userId, openDialog, onDelete }) => {
  return (
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
        <DropdownMenuItem
          className="cursor-pointer flex gap-2 items-center"
          onClick={openDialog}
        >
          <Info />
          <span>View Details</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer flex gap-2 items-center">
          <Share />
          <span>Share</span>
        </DropdownMenuItem>
        {path.includes("/profile") && authorId === userId && (
          <DropdownMenuItem
            className="cursor-pointer flex gap-2 items-center"
            onClick={onDelete}
          >
            <Trash />
            <span>Delete</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ImageCard;
