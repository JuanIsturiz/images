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
import Link from "next/link";
import ImageCard from "./ImageCard";

interface ImageListProps {
  height: string;
  images: Image[] | null;
  userId: string | null;
}

const ImageList: React.FC<ImageListProps> = ({ images, userId, height }) => {
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
      <ScrollArea className={`${height} px-1`}>
        <div className="flex flex-wrap gap-4">
          {images?.map((image) => {
            return (
              <ImageCard
                key={image._id}
                image={image}
                userId={userId}
                pathname={pathname}
                onLike={likeImage}
              />
            );
          })}
        </div>
      </ScrollArea>
    </>
  );
};

export default ImageList;
