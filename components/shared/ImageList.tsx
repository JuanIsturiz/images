"use client";

import Image from "next/image";
import { ScrollArea } from "../ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { GripHorizontal, Heart, Info, Share, Trash } from "lucide-react";
import { favImage } from "@/lib/actions/image.actions";
import { redirect, usePathname } from "next/navigation";

interface Image {
  title: string;
  _id: string;
  imageUrl: string;
  author: {
    _id: string;
    id: string;
    username: string;
    image: string;
  };
  likedBy: string[];
  createdAt: string;
}

interface ImageListProps {
  images: Image[] | null;
  userId: string | null;
}

const ImageList: React.FC<ImageListProps> = ({ images, userId }) => {
  const pathname = usePathname();
  async function likeImage(
    isLiked: boolean,
    imageId: string,
    userId: string | null,
    path: string
  ) {
    if (!userId) {
      redirect("/sign-in");
    }
    await favImage(isLiked, imageId, userId, path);
  }

  return (
    <>
      <ScrollArea className="h-[34rem]">
        <div className="flex flex-wrap gap-4">
          {images?.map((image) => {
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
                    <p>{image.author.username}</p>
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
                <Image
                  src={image.imageUrl}
                  alt={image.title}
                  width={240}
                  height={240}
                />
                <div className="cursor-pointer absolute z-10 bottom-3 right-3 p-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900">
                  {isLiked ? (
                    <Heart
                      className="text-red-600 hover:text-zinc-500"
                      onClick={() =>
                        void likeImage(isLiked, image._id, userId, pathname)
                      }
                    />
                  ) : (
                    <Heart
                      className="hover:text-red-600"
                      onClick={() =>
                        void likeImage(isLiked, image._id, userId, pathname)
                      }
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </>
  );
};

export default ImageList;
