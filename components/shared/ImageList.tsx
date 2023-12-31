"use client";

import { favImage } from "@/lib/actions/image.actions";
import { useRouter, usePathname } from "next/navigation";
import ImageCard from "./ImageCard";

interface ImageListProps {
  images: Image[] | null;
  userId: string | null;
}

const ImageList: React.FC<ImageListProps> = ({ images, userId }) => {
  const pathname = usePathname();
  const router = useRouter();
  async function likeImage(
    isLiked: boolean,
    imageId: string,
    userId: string | null,
    author: string,
    path: string
  ) {
    if (!userId) {
      router.push("/sign-in");
      return;
    }
    await favImage(isLiked, imageId, userId, author, path);
  }

  return (
    <div className="mx-auto flex flex-col sm:items-center justify-center lg:justify-start sm:flex-row sm:flex-wrap gap-4">
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
  );
};

export default ImageList;
