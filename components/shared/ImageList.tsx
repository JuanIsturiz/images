"use client";

import { ScrollArea } from "../ui/scroll-area";
import { favImage } from "@/lib/actions/image.actions";
import { useRouter, usePathname } from "next/navigation";
import ImageCard from "./ImageCard";

interface ImageListProps {
  height: string;
  images: Image[] | null;
  userId: string | null;
}

const ImageList: React.FC<ImageListProps> = ({ images, userId, height }) => {
  const pathname = usePathname();
  const router = useRouter();
  async function likeImage(
    isLiked: boolean,
    imageId: string,
    userId: string | null,
    path: string
  ) {
    if (!userId) {
      router.push("/sign-in");
      return;
    }
    await favImage(isLiked, imageId, userId, path);
  }

  return (
    <>
      <ScrollArea className={`${height} px-1 mb-1`}>
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
